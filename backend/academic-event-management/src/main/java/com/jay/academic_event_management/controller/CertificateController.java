package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.Certificate;
import com.jay.academic_event_management.service.CertificatePdfService;
import com.jay.academic_event_management.service.CertificateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;
    private final CertificatePdfService certificatePdfService;

    public CertificateController(
            CertificateService certificateService,
            CertificatePdfService certificatePdfService
    ) {
        this.certificateService = certificateService;
        this.certificatePdfService = certificatePdfService;
    }

    // ==========================
    // Generate Certificate
    // ==========================

    @PostMapping("/generate/{registrationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Certificate generateCertificate(
            @PathVariable Long registrationId
    ) {

        return certificateService.generateCertificate(registrationId);

    }

    // ==========================
    // Get All Certificates
    // ==========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Certificate> getAllCertificates() {

        return certificateService.getAllCertificates();

    }

    // ==========================
    // Get Certificate By ID
    // ==========================

    @GetMapping("/{id}")
    public Certificate getCertificateById(
            @PathVariable Long id
    ) {

        return certificateService.getCertificateById(id);

    }

    // ==========================
    // Get Certificate By Registration
    // ==========================

    @GetMapping("/registration/{registrationId}")
    public Certificate getByRegistration(
            @PathVariable Long registrationId
    ) {

        return certificateService.getByRegistration(registrationId);

    }

    // ==========================
    // Verify Certificate
    // ==========================

    @GetMapping("/verify/{certificateNumber}")
    public Certificate verifyCertificate(
            @PathVariable String certificateNumber
    ) {

        return certificateService.verifyCertificate(certificateNumber);

    }

    // ==========================
    // Download Certificate PDF
    // ==========================

    @GetMapping("/download/{registrationId}")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long registrationId
    ) {

        Certificate certificate =
                certificateService.getByRegistration(registrationId);

        byte[] pdf =
                certificatePdfService.generateCertificate(certificate);

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Certificate_"
                                + certificate.getCertificateNumber()
                                + ".pdf"
                )

                .contentType(MediaType.APPLICATION_PDF)

                .body(pdf);

    }

}