package com.jay.academic_event_management.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuizSubmissionRequest {

    private Long userId;

    private Long quizId;

    private List<AnswerRequest> answers;

}