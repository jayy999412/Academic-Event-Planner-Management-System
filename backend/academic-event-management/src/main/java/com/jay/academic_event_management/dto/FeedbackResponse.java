package com.jay.academic_event_management.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {

    private Long id;

    private String userName;

    private String eventTitle;

    private Integer rating;

    private String comments;

    private LocalDateTime feedbackDate;

}