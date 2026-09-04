package com.jay.academic_event_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerRequest {

    private Long questionId;

    private String selectedAnswer;

}