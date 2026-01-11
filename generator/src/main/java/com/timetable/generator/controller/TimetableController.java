package com.timetable.generator.controller;

import com.timetable.generator.TimetableMK; // Import your main algorithm class
import com.timetable.generator.dto.SessionData;
import com.timetable.generator.dto.TimetableRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    @PostMapping("/generate")
    public ResponseEntity<?> generateTimetable(@RequestBody TimetableRequest request) {

        // 1. Create an instance of your main class
        TimetableMK mk = new TimetableMK();

        // 2. Destructure the request and initialize your TimeTable object
        int days = request.config().days();
        int sessionsPerDay = request.config().sessionsPerDay();

        List<String> faculties = request.department().faculty();
        List<String> rooms = request.department().rooms();
        List<String> labs = request.department().labs();
        List<String> classes = request.department().classes();

        // This constructor automatically creates all the maps and busy arrays
        TimetableMK.TimeTable tt = mk.new TimeTable(days, sessionsPerDay, faculties, rooms, labs, classes);

        // 3. Initialize the Classwisession object with the sessions to be scheduled
        TimetableMK.Classwisession cs = mk.new Classwisession(classes);

        // Iterate over the sessions map from the JSON and add them to 'cs'
        for (Map.Entry<String, List<SessionData>> entry : request.sessions().entrySet()) {
            String className = entry.getKey();
            List<SessionData> sessionDataList = entry.getValue();

            for (SessionData data : sessionDataList) {
                // Convert from the DTO (SessionData) to your internal logic class (Session)
                TimetableMK.Session session = mk.new Session(
                        data.subject(),
                        data.type(),
                        data.batch(),
                        data.faculty());
                session.location = data.location();
                session.id = data.id(); // preserve frontend id
                cs.addSession(className, session);
            }
        }

        // Iterate over the timetables from the and add them to 'tt'
        for (Map.Entry<String, List<List<SessionData>>> entry : request.timetables().entrySet()) {
            String className = entry.getKey();
            List<List<SessionData>> grid = entry.getValue();
            int classIndex = tt.classMap.get(className);

            for (int d = 0; d < grid.size(); d++) {
                List<SessionData> row = grid.get(d);
                for (int s = 0; s < row.size(); s++) {
                    SessionData data = row.get(s);
                    if (data != null) {
                        // Convert from SessionData to Session
                        TimetableMK.Session session = mk.new Session(
                                data.subject(),
                                data.type(),
                                data.batch(),
                                data.faculty());
                        session.location = data.location();
                        session.id = data.id(); // preserve id for prefilled slots
                        // Place the session in the timetable
                        tt.classtable[classIndex][d][s] = session;
                    }
                }
            }
        }

        // 4. Run the backtracking algorithm
        boolean success = mk.check(tt);

        if (!success) {
            // Convert the current state (with clash information) to response format
            Map<String, List<List<SessionData>>> resultTimetables = new HashMap<>();

            for (String className : classes) {
                int classIndex = tt.classMap.get(className);
                List<List<SessionData>> grid = new ArrayList<>();

                for (int d = 0; d < days * 2; d++) {
                    List<SessionData> row = new ArrayList<>();
                    for (int s = 0; s < sessionsPerDay; s++) {
                        TimetableMK.Session session = tt.classtable[classIndex][d][s];
                        if (session != null) {
                            row.add(new SessionData(
                                    session.id,
                                    session.subject,
                                    session.type,
                                    session.batch,
                                    session.faculty,
                                    session.location,
                                    session.notPlaceable,
                                    session.isLabContinuation,
                                    session.isABMirror));
                        } else {
                            row.add(null);
                        }
                    }
                    grid.add(row);
                }
                resultTimetables.put(className, grid);
            }
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Timetable has clashing sessions",
                    "timetables", resultTimetables));
        }
        
        //Shuffle sessions before attempting backtracking again
        cs.shuffleSessions();

        success = mk.backtrack(tt, cs, 0, 0, 0);

        // 5. Return the result
        if (success) {
            // Convert the resulting tt.classtable back into a JSON-friendly map
            Map<String, List<List<SessionData>>> resultTimetables = new HashMap<>();

            for (String className : classes) {
                int classIndex = tt.classMap.get(className);
                List<List<SessionData>> grid = new ArrayList<>();

                for (int d = 0; d < days * 2; d++) { // d*2 for A/B batches
                    List<SessionData> row = new ArrayList<>();
                    for (int s = 0; s < sessionsPerDay; s++) {
                        TimetableMK.Session session = tt.classtable[classIndex][d][s];
                        if (session != null) {
                            // return the same id back to frontend
                            row.add(new SessionData(
                                    session.id, session.subject, session.type, session.batch, session.faculty,
                                    session.location, session.notPlaceable, session.isLabContinuation,
                                    session.isABMirror));
                        } else {
                            row.add(null);
                        }
                    }
                    grid.add(row);
                }
                resultTimetables.put(className, grid);
            }
            return ResponseEntity.ok(resultTimetables);

        } else {
            // If the algorithm fails, send an error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No valid timetable could be generated with the given constraints.");
        }
    }
}
