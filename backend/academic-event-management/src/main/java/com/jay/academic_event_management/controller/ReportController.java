package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.*;
import com.jay.academic_event_management.service.ReportService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // ========================
    // REGISTRATION REPORTS
    // ========================

    @GetMapping("/registrations")
    public List<Registration> getRegistrationReport() {
        return reportService.getRegistrationReport();
    }

    @GetMapping("/registrations/filtered")
    public List<Registration> getRegistrationReportFiltered(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) String status) {
        return reportService.getRegistrationReportFiltered(eventId, status);
    }

    // ========================
    // ATTENDANCE REPORTS
    // ========================

    @GetMapping("/attendance")
    public List<Registration> getAttendanceReport() {
        return reportService.getAttendanceReport();
    }

    @GetMapping("/attendance/filtered")
    public List<Registration> getAttendanceReportFiltered(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) String status) {
        return reportService.getAttendanceReportFiltered(eventId, status);
    }

    // ========================
    // PAYMENT REPORTS
    // ========================

    @GetMapping("/payments")
    public List<Payment> getPaymentReport() {
        return reportService.getPaymentReport();
    }

    @GetMapping("/payments/filtered")
    public List<Payment> getPaymentReportFiltered(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) String status) {
        return reportService.getPaymentReportFiltered(eventId, status);
    }

    // ========================
    // CERTIFICATE REPORTS
    // ========================

    @GetMapping("/certificates")
    public List<Certificate> getCertificateReport() {
        return reportService.getCertificateReport();
    }

    @GetMapping("/certificates/filtered")
    public List<Certificate> getCertificateReportFiltered(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) String status) {
        return reportService.getCertificateReportFiltered(eventId, status);
    }

    // ========================
    // FEEDBACK REPORTS
    // ========================

    @GetMapping("/feedback")
    public List<Feedback> getFeedbackReport() {
        return reportService.getFeedbackReport();
    }

    @GetMapping("/feedback/filtered")
    public List<Feedback> getFeedbackReportFiltered(
            @RequestParam(required = false) Long eventId) {
        return reportService.getFeedbackReportFiltered(eventId);
    }

    // ========================
    // USER REPORTS
    // ========================

    @GetMapping("/users")
    public List<User> getUserReport() {
        return reportService.getUserReport();
    }

    @GetMapping("/users/filtered")
    public List<User> getUserReportFiltered(
            @RequestParam(required = false) String role) {
        return reportService.getUserReportFiltered(role);
    }

    // ========================
    // QUIZ REPORTS
    // ========================

    @GetMapping("/quizzes")
    public List<Quiz> getQuizReport() {
        return reportService.getQuizReport();
    }

    // ========================
    // EVENTS (for filter dropdowns)
    // ========================

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return reportService.getAllEvents();
    }
}
