package com.timetable.generator;

import java.util.*;

public class TimetableMK {
    public class Session {
        public long id = 0;
        public String subject;
        public String type; // lecture, lab, tutorial
        public String batch; // e.g., A,B,AB
        public List<String> faculty; // one or more faculty
        public String location; // lab no. or classroom
        public boolean isLabContinuation; // indicates if this session is a continuation of a lab
        public boolean isABMirror; // indicates if this session is an AB mirror session
        public boolean notPlaceable; // indicates if this session is not placeable

        public Session(String subject, String type, String batch, List<String> faculty, String location) {
            this.subject = subject;
            this.type = type;
            this.batch = null;
            this.faculty = faculty;
            this.location = location;
            this.notPlaceable = false;
        }

        public Session(String subject, String type, String batch, List<String> faculty) {
            this.subject = subject;
            this.type = type;
            this.batch = batch;
            this.faculty = faculty;
            this.notPlaceable = false;
        }
    }

    public class TimeTable {
        public int days, sessionsPerDay;
        public Session[][][] classtable; // [classIndex][day X 2][session]
        public Session[][][] facultytable; // [facultyIndex][day][session]
        public Session[][][] roomtable; // [roomIndex][day][session]
        public Session[][][] labtable; // [labIndex][day][session]
        public boolean[][][] facultyBusy; // [facultyIndex][day][session]
        public boolean[][][] roomBusy; // [roomIndex][day][session]
        public boolean[][][] labBusy; // [labIndex][day][session]
        public boolean[][][] classBusy; // [classIndex][day][session]
        public Map<String, Integer> facultyMap; // faculty name to index
        public Map<String, Integer> roomMap; // room name to index
        public Map<String, Integer> classMap; // class name to index
        public Map<String, Integer> labMap; // lab name to index

        public TimeTable(int days, int sessionsPerDay, List<String> faculties, List<String> rooms, List<String> labs,
                List<String> classes) {
            this.days = days;
            this.sessionsPerDay = sessionsPerDay;
            this.classtable = new Session[classes.size()][2 * days][sessionsPerDay];
            this.facultytable = new Session[faculties.size()][days][sessionsPerDay];
            this.roomtable = new Session[rooms.size()][days][sessionsPerDay];
            this.labtable = new Session[labs.size()][days][sessionsPerDay];
            this.facultyBusy = new boolean[faculties.size()][days][sessionsPerDay];
            this.roomBusy = new boolean[rooms.size()][days][sessionsPerDay];
            this.labBusy = new boolean[labs.size()][days][sessionsPerDay];
            this.classBusy = new boolean[classes.size()][days * 2][sessionsPerDay];
            this.facultyMap = new HashMap<>();
            this.roomMap = new HashMap<>();
            this.classMap = new HashMap<>();
            this.labMap = new HashMap<>();
            for (int i = 0; i < faculties.size(); i++) {
                facultyMap.put(faculties.get(i), i);
            }
            for (int i = 0; i < rooms.size(); i++) {
                roomMap.put(rooms.get(i), i);
            }
            for (int i = 0; i < labs.size(); i++) {
                labMap.put(labs.get(i), i);
            }
            for (int i = 0; i < classes.size(); i++) {
                classMap.put(classes.get(i), i);
            }
        }

        // Mark faculty busy/free
        public void markFaculty(Session s, int day, int slot, boolean busy) {
            for (String f : s.faculty) {
                int idx = facultyMap.get(f);
                facultyBusy[idx][day / 2][slot] = busy;
                facultytable[idx][day / 2][slot] = busy ? s : null;
            }
        }

        // Mark room busy/free
        public void markRoom(Session s, int day, int slot, String room, boolean busy) {
            int r = roomMap.get(room);
            roomBusy[r][day / 2][slot] = busy;
            roomtable[r][day / 2][slot] = busy ? s : null;
        }

        // Mark lab busy/free
        public void markLab(Session s, int day, int slot, String lab, boolean busy) {
            int l = labMap.get(lab);
            labBusy[l][day / 2][slot] = busy;
            labtable[l][day / 2][slot] = busy ? s : null;
        }

        // Mark class busy/free
        public void markClass(Session s, int classIndex, int day, int slot, boolean busy) {
            if (s.batch == null || s.batch.equalsIgnoreCase("AB")) {
                classBusy[classIndex][day][slot] = busy;
                classtable[classIndex][day][slot] = busy ? s : null;
                classBusy[classIndex][day + 1][slot] = busy;
                classtable[classIndex][day + 1][slot] = busy ? s : null;
            } else {
                classBusy[classIndex][day][slot] = busy;
                classtable[classIndex][day][slot] = busy ? s : null;
            }
        }

        public boolean canPlace(Session s, int classIndex, int day, int slot, String location) {
            // Check if session can be placed at given time and location
            if (s.type.equalsIgnoreCase("Lab")) {
                if (s.batch != null && s.batch.equalsIgnoreCase("AB")) {
                    if (day % 2 == 1 || classBusy[classIndex][day][slot] || classBusy[classIndex][day + 1][slot] ||
                            classBusy[classIndex][day][slot + 1] || classBusy[classIndex][day + 1][slot + 1])
                        return false;
                } else {
                    if (classBusy[classIndex][day][slot] || classBusy[classIndex][day][slot + 1])
                        return false;
                }
                if (!location.equals("NA")) {
                    int labIndex = labMap.get(location);
                    if (labBusy[labIndex][day / 2][slot] || labBusy[labIndex][day / 2][slot + 1])
                        return false;
                }
            } else {
                if (day % 2 == 1)
                    return false; // Lectures only in first half of the day
                if (classBusy[classIndex][day][slot] || classBusy[classIndex][day + 1][slot])
                    return false;
                if (!location.equals("NA")) {
                    int roomIndex = roomMap.get(location);
                    if (roomBusy[roomIndex][day / 2][slot])
                        return false;
                }
            }
            return true;
        }

        public boolean facultyCheck(List<String> faculties, int day, int slot) {
            for (String f : faculties) {
                int idx = facultyMap.get(f);
                if (facultyBusy[idx][day / 2][slot])
                    return false;
            }
            return true;
        }

        public void place(Session s, int classIndex, int day, int slot, String location) {
            s.location = location;
            if (s.type.equalsIgnoreCase("Lab")) {
                markClass(s, classIndex, day, slot, true);
                markClass(s, classIndex, day, slot + 1, true); // mark next slot too
                markLab(s, day, slot, location, true);
                markLab(s, day, slot + 1, location, true); // mark next slot too
                markFaculty(s, day, slot, true);
                markFaculty(s, day, slot + 1, true);
            } else {
                markClass(s, classIndex, day, slot, true);
                markRoom(s, day, slot, location, true);
                markFaculty(s, day, slot, true);
            }
        }

        public void remove(Session s, int classIndex, int day, int slot) {
            if (s.type.equalsIgnoreCase("Lab")) {
                markClass(s, classIndex, day, slot, false);
                markClass(s, classIndex, day, slot + 1, false); // unmark next slot too
                markLab(s, day, slot, s.location, false);
                markLab(s, day, slot + 1, s.location, false); // unmark next slot too
                markFaculty(s, day, slot, false);
                markFaculty(s, day, slot + 1, false);
            } else {
                markClass(s, classIndex, day, slot, false);
                markRoom(s, day, slot, s.location, false);
                markFaculty(s, day, slot, false);
            }
            s.location = null;
        }
    }

    public class Classwisession {
        public Map<String, Integer> classMap; // class name to index
        public List<Session>[] sessions; // sessions for this class

        @SuppressWarnings("unchecked")
        public Classwisession(List<String> classes) {
            this.classMap = new HashMap<>();
            // initialize the array of lists
            this.sessions = (List<Session>[]) new ArrayList[classes.size()];
            for (int i = 0; i < classes.size(); i++) {
                classMap.put(classes.get(i), i);
                this.sessions[i] = new ArrayList<>();
            }
        }

        public void addSession(String className, Session session) {
            int classIndex = classMap.get(className);
            sessions[classIndex].add(session);
        }

        public void shuffleSessions() {
            for (List<Session> sessionList : sessions) {
                Collections.shuffle(sessionList, new Random());
            }
        }
    }

    public boolean check(TimeTable tt) {
        Set<Long> ids = new HashSet<>();
        boolean valid = true;
        // Check if initial timetable is valid
        for (int c = 0; c < tt.classtable.length; c++) {
            for (int d = 0; d < tt.days * 2; d++) {
                for (int s = 0; s < tt.sessionsPerDay; s++) {
                    Session session = tt.classtable[c][d][s];
                    if (session != null) {
                        if (ids.contains(session.id) && session.id != 0) {
                            continue; // duplicate id found
                        }
                        ids.add(session.id);
                        if (session.type.equalsIgnoreCase("Lab")) {
                            boolean facultyclash = false;
                            for (String f : session.faculty) {
                                int fIndex = tt.facultyMap.get(f);
                                if (tt.facultyBusy[fIndex][d / 2][s] || tt.facultyBusy[fIndex][d / 2][s + 1]) {
                                    facultyclash = true;
                                    session.notPlaceable = true;
                                    Session clash = tt.facultytable[fIndex][d / 2][s];
                                    if (clash != null) {
                                        clash.notPlaceable = true;
                                    }
                                }
                            }
                            if (facultyclash) {
                                valid = false;
                                continue;
                            }
                            boolean labFound = false;
                            for (String lab : tt.labMap.keySet()) {
                                int labIndex = tt.labMap.get(lab);
                                if (tt.labBusy[labIndex][d / 2][s] || tt.labBusy[labIndex][d / 2][s + 1]) {
                                    continue; // lab busy
                                } else {
                                    tt.markLab(session, d, s, lab, true);
                                    tt.markLab(session, d, s + 1, lab, true);
                                    session.location = lab;
                                    labFound = true;
                                    break;
                                }
                            }
                            if (!labFound) {
                                valid = false; // no lab found
                                session.notPlaceable = true;
                                continue;
                            }
                            tt.markFaculty(session, d, s, true);
                            tt.markFaculty(session, d, s + 1, true);
                            tt.markClass(session, c, d, s, true);
                            tt.markClass(session, c, d, s + 1, true);
                        } else {
                            boolean facultyclash = false;
                            for (String f : session.faculty) {
                                int fIndex = tt.facultyMap.get(f);
                                if (tt.facultyBusy[fIndex][d / 2][s]) {
                                    facultyclash = true;
                                    session.notPlaceable = true;
                                    Session clash = tt.facultytable[fIndex][d / 2][s];
                                    if (clash != null) {
                                        clash.notPlaceable = true;
                                    }
                                }
                            }
                            if (facultyclash) {
                                valid = false;
                                continue;
                            }
                            boolean roomFound = false;
                            for (String room : tt.roomMap.keySet()) {
                                int roomIndex = tt.roomMap.get(room);
                                if (tt.roomBusy[roomIndex][d / 2][s]) {
                                    continue; // room busy
                                } else {
                                    tt.markRoom(session, d, s, room, true);
                                    session.location = room;
                                    roomFound = true;
                                    break;
                                }
                            }
                            if (!roomFound) {
                                valid = false; // no room found
                                session.notPlaceable = true;
                                continue;
                            }
                            tt.markFaculty(session, d, s, true);
                            tt.markClass(session, c, d, s, true);
                        }
                    }
                }
            }
        }
        return valid;
    }

    public boolean backtrack(TimeTable tt, Classwisession cs, int classIndex, int day, int session) {
        if (classIndex == tt.classtable.length)
            return true; // All classes done
        if (day == tt.days * 2) {
            if (!cs.sessions[classIndex].isEmpty())
                return false; // Not all sessions scheduled
            return backtrack(tt, cs, classIndex + 1, 0, 0);
        }
        if (session == tt.sessionsPerDay)
            return backtrack(tt, cs, classIndex, day + 1, 0);
        if (tt.classtable[classIndex][day][session] != null) {
            // Already filled, move to next slot
            return backtrack(tt, cs, classIndex, day, session + 1);
        }
        if (cs.sessions[classIndex].isEmpty()) {
            // No sessions left for this class, move to next slot
            return backtrack(tt, cs, classIndex + 1, 0, 0); // move to next class
        }
        // Snapshot to avoid ConcurrentModificationException
        List<Session> pending = new ArrayList<>(cs.sessions[classIndex]);
        for (Session s : pending) {
            if (s.type.equalsIgnoreCase("Lab")) {
                if (session % 2 == 1 || session + 1 >= tt.sessionsPerDay || !tt.facultyCheck(s.faculty, day, session)
                        || !tt.facultyCheck(s.faculty, day, session + 1)) {
                    continue; // faculty busy
                }
                if (s.batch != null && s.batch.equalsIgnoreCase("AB") && day + 1 >= 2 * tt.days)
                    continue; // not enough days for AB batch lab
                if (s.batch != null && !s.batch.equalsIgnoreCase("AB")) {
                    if (day % 2 == 0 && s.batch.equalsIgnoreCase("B"))
                        continue;
                    if (day % 2 == 1 && s.batch.equalsIgnoreCase("A"))
                        continue;
                }
                for (String lab : tt.labMap.keySet()) {
                    if (tt.canPlace(s, classIndex, day, session, lab)) {
                        tt.place(s, classIndex, day, session, lab);
                        int idx = cs.sessions[classIndex].indexOf(s);
                        cs.sessions[classIndex].remove(idx);
                        if (backtrack(tt, cs, classIndex, day, session + 2))
                            return true;
                        tt.remove(s, classIndex, day, session);
                        cs.sessions[classIndex].add(idx, s); // restore at correct position
                    }
                }
            } else {
                if (!tt.facultyCheck(s.faculty, day, session)) {
                    continue; // faculty busy
                }
                for (String room : tt.roomMap.keySet()) {
                    if (tt.canPlace(s, classIndex, day, session, room)) {
                        tt.place(s, classIndex, day, session, room);
                        int idx = cs.sessions[classIndex].indexOf(s);
                        cs.sessions[classIndex].remove(idx);
                        if (backtrack(tt, cs, classIndex, day, session + 1))
                            return true;
                        tt.remove(s, classIndex, day, session);
                        cs.sessions[classIndex].add(idx, s); // restore at correct position
                    }
                }
            }
        }
        // Try leaving slot empty
        if (backtrack(tt, cs, classIndex, day, session + 1))
            return true;
        return false;
    }
}