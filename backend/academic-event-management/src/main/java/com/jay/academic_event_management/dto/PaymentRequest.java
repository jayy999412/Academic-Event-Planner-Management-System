package com.jay.academic_event_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {

    private Long registrationId;

    private Double amount;

    private String paymentMethod;

}