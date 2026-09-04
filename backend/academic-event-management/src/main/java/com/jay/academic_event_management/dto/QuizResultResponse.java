package com.jay.academic_event_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class QuizResultResponse {

    private Integer score;

    private Integer totalMarks;

    private Double percentage;

    private String status;

}