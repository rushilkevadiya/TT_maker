package com.timetable.generator.dto;

import java.util.List;

public record SessionData(
    long id,
    String subject,
    String type,
    String batch,
    List<String> faculty,
    String location,
    Boolean notPlaceable,   // Must be present
    Boolean isLabContinuation, // Must be present
    Boolean isABMirror         // Must be present
) {}