package com.timetable.generator.dto;

import java.util.List;
import java.util.Map;

public record TimetableRequest(
    ConfigData config,
    DepartmentData department,
    Map<String, List<SessionData>> sessions,
    Map<String, List<List<SessionData>>> timetables // Handles the 'timetables' grid
) {}
