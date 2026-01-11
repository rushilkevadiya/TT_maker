package com.timetable.generator.dto;

import java.util.List;

public record DepartmentData(
    List<String> classes,
    List<String> labs,
    List<String> rooms,
    List<String> subjects,
    List<String> faculty
) {}
