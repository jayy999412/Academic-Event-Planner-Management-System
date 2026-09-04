package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.dto.PaymentRequest;
import com.jay.academic_event_management.entity.Payment;
import com.jay.academic_event_management.service.PaymentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ==========================
    // Make Payment
    // ==========================

    @PostMapping("/pay")
    public Payment makePayment(
            @RequestBody PaymentRequest request
    ) {
        return paymentService.makePayment(request);
    }

    // ==========================
    // Get All Payments (Admin only)
    // ==========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // ==========================
    // Get Student Payments
    // ==========================

    @GetMapping("/student/{userId}")
    public List<Payment> getStudentPayments(
            @PathVariable Long userId
    ) {
        return paymentService.getStudentPayments(userId);
    }

    // ==========================
    // Get Payment By Id
    // ==========================

    @GetMapping("/{id}")
    public Payment getPayment(
            @PathVariable Long id
    ) {
        return paymentService.getPayment(id);
    }

    // ==========================
    // Get Payment By Registration
    // ==========================

    @GetMapping("/registration/{registrationId}")
    public Payment getPaymentByRegistration(
            @PathVariable Long registrationId
    ) {
        return paymentService.getPaymentByRegistration(registrationId);
    }

}