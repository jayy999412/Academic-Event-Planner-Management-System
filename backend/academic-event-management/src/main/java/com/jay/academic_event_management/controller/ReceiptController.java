package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.Payment;
import com.jay.academic_event_management.service.PaymentService;
import com.jay.academic_event_management.service.ReceiptService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;
    private final PaymentService paymentService;

    public ReceiptController(
            ReceiptService receiptService,
            PaymentService paymentService) {

        this.receiptService = receiptService;
        this.paymentService = paymentService;
    }

    @GetMapping("/download/{paymentId}")
    public ResponseEntity<byte[]> downloadReceipt(
            @PathVariable Long paymentId) {

        Payment payment = paymentService.getPayment(paymentId);

        byte[] pdf = receiptService.generateReceipt(payment);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Receipt_" +
                                payment.getReceiptNumber() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

}