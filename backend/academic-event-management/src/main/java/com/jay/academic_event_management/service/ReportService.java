package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.*;
import com.jay.academic_event_management.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final RegistrationRepository registrationRepository;
    private final CertificateRepository certificateRepository;
    private final FeedbackRepository feedbackRepository;
    private final QuizRepository quizRepository;
    private final PaymentRepository paymentRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public ReportService(RegistrationRepository registrationRepository,
                         CertificateRepository certificateRepository,
                         FeedbackRepository feedbackRepository,
                         QuizRepository quizRepository,
                         PaymentRepository paymentRepository,
                         EventRepository eventRepository,
                         UserRepository userRepository) {
        this.registrationRepository = registrationRepository;
        this.certificateRepository = certificateRepository;
        this.feedbackRepository = feedbackRepository;
        this.quizRepository = quizRepository;
        this.paymentRepository = paymentRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    // ========================
    // REGISTRATION REPORTS
    // ========================

    public List<Registration> getRegistrationReport() {
        return registrationRepository.findAll();
    }

    public List<Registration> getRegistrationReportFiltered(Long eventId, String status) {
        return registrationRepository.findAll().stream()
                .filter(r -> eventId == null || (r.getEvent() != null && r.getEvent().getId().equals(eventId)))
                .filter(r -> status == null || status.isEmpty() || r.getStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }

    // ========================
    // ATTENDANCE REPORTS
    // ========================

    public List<Registration> getAttendanceReport() {
        return registrationRepository.findAll().stream()
                .filter(r -> !"Not Marked".equalsIgnoreCase(r.getAttendanceStatus()))
                .collect(Collectors.toList());
    }

    public List<Registration> getAttendanceReportFiltered(Long eventId, String status) {
        return registrationRepository.findAll().stream()
                .filter(r -> !"Not Marked".equalsIgnoreCase(r.getAttendanceStatus()))
                .filter(r -> eventId == null || (r.getEvent() != null && r.getEvent().getId().equals(eventId)))
                .filter(r -> status == null || status.isEmpty() || r.getAttendanceStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }

    // ========================
    // PAYMENT REPORTS
    // ========================

    public List<Payment> getPaymentReport() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentReportFiltered(Long eventId, String status) {
        return paymentRepository.findAll().stream()
                .filter(p -> {
                    if (eventId == null) return true;
                    return p.getRegistration() != null
                            && p.getRegistration().getEvent() != null
                            && p.getRegistration().getEvent().getId().equals(eventId);
                })
                .filter(p -> status == null || status.isEmpty() || p.getPaymentStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }

    // ========================
    // CERTIFICATE REPORTS
    // ========================

    public List<Certificate> getCertificateReport() {
        return certificateRepository.findAll();
    }

    public List<Certificate> getCertificateReportFiltered(Long eventId, String status) {
        return certificateRepository.findAll().stream()
                .filter(c -> {
                    if (eventId == null) return true;
                    return c.getRegistration() != null
                            && c.getRegistration().getEvent() != null
                            && c.getRegistration().getEvent().getId().equals(eventId);
                })
                .filter(c -> status == null || status.isEmpty() || c.getStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }

    // ========================
    // FEEDBACK REPORTS
    // ========================

    public List<Feedback> getFeedbackReport() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> getFeedbackReportFiltered(Long eventId) {
        if (eventId != null) {
            return feedbackRepository.findByRegistrationEventIdOrderByFeedbackDateDesc(eventId);
        }
        return feedbackRepository.findAll();
    }

    // ========================
    // USER REPORTS
    // ========================

    public List<User> getUserReport() {
        return userRepository.findAll();
    }

    public List<User> getUserReportFiltered(String role) {
        if (role != null && !role.isEmpty()) {
            return userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && u.getRole().getRoleName().equalsIgnoreCase(role))
                    .collect(Collectors.toList());
        }
        return userRepository.findAll();
    }

    // ========================
    // QUIZ REPORTS
    // ========================

    public List<Quiz> getQuizReport() {
        return quizRepository.findAll();
    }

    // ========================
    // EVENT LIST (for filter dropdowns)
    // ========================

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
}
