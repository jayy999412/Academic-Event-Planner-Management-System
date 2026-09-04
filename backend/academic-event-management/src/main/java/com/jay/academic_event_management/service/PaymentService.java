package com.jay.academic_event_management.service;

import com.jay.academic_event_management.dto.PaymentRequest;
import com.jay.academic_event_management.entity.Payment;
import com.jay.academic_event_management.entity.Registration;
import com.jay.academic_event_management.repository.PaymentRepository;
import com.jay.academic_event_management.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RegistrationRepository registrationRepository;
    private final NotificationService notificationService;

    public PaymentService(
            PaymentRepository paymentRepository,
            RegistrationRepository registrationRepository,
            NotificationService notificationService
    ) {
        this.paymentRepository = paymentRepository;
        this.registrationRepository = registrationRepository;
        this.notificationService = notificationService;
    }

    // ==========================
    // Make Payment
    // ==========================

    public Payment makePayment(PaymentRequest request) {

        Registration registration =
                registrationRepository.findById(request.getRegistrationId())
                        .orElseThrow(() -> new RuntimeException("Registration not found"));

        Payment payment = new Payment();
        payment.setRegistration(registration);
        payment.setAmount(registration.getEvent().getRegistrationFee());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());

        // Generate Transaction ID
        payment.setTransactionId(
                "TXN" + System.currentTimeMillis()
        );

        // Generate Receipt Number
        payment.setReceiptNumber(
                "REC" + System.currentTimeMillis()
        );

        registration.setPaymentStatus("SUCCESS");
        registrationRepository.save(registration);

        Payment savedPayment = paymentRepository.save(payment);

        // ==========================
        // Create Payment Notification
        // ==========================
        notificationService.createNotificationWithType(
                registration.getUser(),
                "Payment Successful",
                "Your payment of Rs. " + registration.getEvent().getRegistrationFee()
                        + " for event '" + registration.getEvent().getEventTitle()
                        + "' has been received successfully. Transaction ID: "
                        + savedPayment.getTransactionId(),
                "PAYMENT"
        );

        return savedPayment;
    }

    // ==========================
    // Get All Payments
    // ==========================

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // ==========================
    // Get Student Payments
    // ==========================

    public List<Payment> getStudentPayments(Long userId) {
        return paymentRepository.findByRegistrationUserId(userId);
    }

    // ==========================
    // Get Payment By Id
    // ==========================

    public Payment getPayment(Long id) {

        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

    }

    // ==========================
    // Get Payment By Registration
    // ==========================

    public Payment getPaymentByRegistration(Long registrationId) {

        return paymentRepository
                .findByRegistrationId(registrationId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

    }

}