package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.dto.RegistrationRequest;
import com.jay.academic_event_management.entity.Registration;
import com.jay.academic_event_management.service.RegistrationService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    // ==========================
    // Register Student
    // ==========================

    @PostMapping("/register")
    public Registration registerStudent(
            @RequestBody RegistrationRequest request) {

        return registrationService.registerStudent(request);
    }

    // ==========================
    // Check Registration Status
    // ==========================

    @GetMapping("/check")
    public boolean checkRegistration(
            @RequestParam Long userId,
            @RequestParam Long eventId) {

        return registrationService.isAlreadyRegistered(userId, eventId);
    }

    // ==========================
    // Get All Registrations
    // ==========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Registration> getAllRegistrations() {

        return registrationService.getAllRegistrations();
    }

    // ==========================
    // Get Student Registrations
    // ==========================

    @GetMapping("/student/{userId}")
    public List<Registration> getStudentRegistrations(
            @PathVariable Long userId) {

        return registrationService.getStudentRegistrations(userId);
    }

    // ==========================
    // Get Event Participants
    // ==========================

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Registration> getEventParticipants(
            @PathVariable Long eventId) {

        return registrationService.getEventParticipants(eventId);
    }

    // ==========================
    // Approve Registration
    // ==========================

    @PutMapping("/approve/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Registration approveRegistration(
            @PathVariable Long id) {

        return registrationService.approveRegistration(id);
    }

    // ==========================
    // Reject Registration
    // ==========================

    @PutMapping("/reject/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Registration rejectRegistration(
            @PathVariable Long id) {

        return registrationService.rejectRegistration(id);
    }

    // ==========================
    // Cancel Registration
    // ==========================

    @PutMapping("/cancel/{id}")
    public Registration cancelRegistration(
            @PathVariable Long id) {

        return registrationService.cancelRegistration(id);
    }

    // ==========================
    // Mark Attendance (Admin Manual)
    // ==========================

    @PutMapping("/attendance/{id}/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public Registration markAttendance(
            @PathVariable Long id,
            @PathVariable String status) {

        return registrationService.markAttendance(id, status);
    }

}
