package com.jay.academic_event_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequest {

    private String title;

    private String message;

    private String type;

    private Long userId;

}
