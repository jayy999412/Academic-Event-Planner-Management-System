package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Certificate;
import com.jay.academic_event_management.entity.Registration;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.repository.CertificateRepository;
import com.jay.academic_event_management.repository.RegistrationRepository;
import com.jay.academic_event_management.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final RegistrationRepository registrationRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public CertificateService(
            CertificateRepository certificateRepository,
            RegistrationRepository registrationRepository,
            NotificationService notificationService,
            UserRepository userRepository,
            EmailService emailService) {

        this.certificateRepository = certificateRepository;
        this.registrationRepository = registrationRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // ==========================
    // Generate Certificate
    // ==========================

    public Certificate generateCertificate(Long registrationId) {

        Certificate existing =
                certificateRepository
                        .findByRegistrationId(registrationId)
                        .orElse(null);

        if (existing != null) {
            return existing;
        }

        Registration registration =
                registrationRepository.findById(registrationId)
                        .orElseThrow(() ->
                                new RuntimeException("Registration not found"));

        Certificate certificate = new Certificate();

        certificate.setRegistration(registration);

        certificate.setCertificateNumber(
                "CERT-" + System.currentTimeMillis()
        );

        certificate.setIssueDate(LocalDate.now());

        certificate.setCertificateUrl("");

        certificate.setStatus("Generated");

        Certificate saved = certificateRepository.save(certificate);

        // Notify the student
        notificationService.createNotificationWithType(
                registration.getUser(),
                "Certificate Generated",
                "Your certificate for event '"
                        + registration.getEvent().getEventTitle()
                        + "' has been generated. Certificate Number: "
                        + certificate.getCertificateNumber(),
                "CERTIFICATE"
        );

        // Notify the current logged-in user (admin/faculty)
        User currentUser = getCurrentUser();
        if (currentUser != null && !currentUser.getId().equals(registration.getUser().getId())) {
            notificationService.createNotificationWithType(
                    currentUser,
                    "Certificate Generated",
                    "You have successfully generated a certificate for "
                            + registration.getUser().getFullName()
                            + " in event '" + registration.getEvent().getEventTitle()
                            + "'. Certificate Number: " + certificate.getCertificateNumber(),
                    "CERTIFICATE"
            );
        }

        // Send certificate email
        emailService.sendCertificateNotification(
                registration.getUser(),
                certificate.getCertificateNumber(),
                registration.getEvent()
        );

        return saved;
    }

    // ==========================
    // Get Current Logged-in User
    // ==========================

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }

    // ==========================
    // Get All Certificates
    // ==========================

    public List<Certificate> getAllCertificates() {

        return certificateRepository.findAll();

    }

    // ==========================
    // Get Certificate By ID
    // ==========================

    public Certificate getCertificateById(Long id) {

        return certificateRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Certificate not found"));

    }

    // ==========================
    // Get Certificate By Registration
    // ==========================

    public Certificate getByRegistration(Long registrationId) {

        return certificateRepository
                .findByRegistrationId(registrationId)
                .orElseThrow(() ->
                        new RuntimeException("Certificate not found"));

    }

    // ==========================
    // Verify Certificate
    // ==========================

    public Certificate verifyCertificate(String certificateNumber) {

        return certificateRepository
                .findByCertificateNumber(certificateNumber)
                .orElseThrow(() ->
                        new RuntimeException("Invalid Certificate"));

    }

    // ==========================
    // Delete Certificate
    // ==========================

    public void deleteCertificate(Long id) {

        certificateRepository.deleteById(id);

    }

}