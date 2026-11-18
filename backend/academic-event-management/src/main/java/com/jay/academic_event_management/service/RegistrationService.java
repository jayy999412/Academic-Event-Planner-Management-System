package com.jay.academic_event_management.service;

import com.jay.academic_event_management.dto.RegistrationRequest;
import com.jay.academic_event_management.entity.Event;
import com.jay.academic_event_management.entity.Registration;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.repository.EventRepository;
import com.jay.academic_event_management.repository.RegistrationRepository;
import com.jay.academic_event_management.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            UserRepository userRepository,
            EventRepository eventRepository,
            NotificationService notificationService,
            EmailService emailService
    ) {
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }

    // ==========================
    // Register Student
    // ==========================
    public Registration registerStudent(RegistrationRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Duplicate Registration Check
        if (registrationRepository
                .findByUserIdAndEventId(request.getUserId(), request.getEventId())
                .isPresent()) {

            throw new RuntimeException("You have already registered for this event.");
        }

        // Capacity Check (uses COUNT query instead of loading all registrations)
        long totalRegistered = registrationRepository.countByEventId(event.getId());

        if (totalRegistered >= event.getMaxParticipants()) {
            throw new RuntimeException("Event registration is full.");
        }

        // Use authenticated user from JWT, not the userId from request
        User authenticatedUser = getCurrentUser();
        if (authenticatedUser == null) {
            throw new RuntimeException("Unauthorized: Please login to register.");
        }

        Registration registration = new Registration();

        registration.setUser(authenticatedUser);
        registration.setEvent(event);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus("Pending");
        registration.setPaymentStatus("Pending");
        registration.setAttendanceStatus("Not Marked");

        Registration savedRegistration = registrationRepository.save(registration);

        // ==========================
        // Create Notification
        // ==========================
        notificationService.createNotificationWithType(
                user,
                "Registration Successful",
                "You have successfully registered for "
                        + event.getEventTitle()
                        + ". Waiting for approval.",
                "REGISTRATION"
        );

        // ==========================
        // Send Registration Confirmation Email
        // ==========================
        emailService.sendRegistrationConfirmation(user, event);

        return savedRegistration;
    }

    // ==========================
    // Check Duplicate Registration
    // ==========================
    public boolean isAlreadyRegistered(Long userId, Long eventId) {
        return registrationRepository
                .findByUserIdAndEventId(userId, eventId)
                .isPresent();
    }

    // ==========================
    // Get All Registrations
    // ==========================
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    // ==========================
    // Student Registrations
    // ==========================
    public List<Registration> getStudentRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    // ==========================
    // Event Participants
    // ==========================
    public List<Registration> getEventParticipants(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    // ==========================
    // Approve Registration
    // ==========================
    public Registration approveRegistration(Long id) {

        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registration.setStatus("Approved");

        Registration updatedRegistration = registrationRepository.save(registration);

        // Notify the student
        notificationService.createNotificationWithType(
                registration.getUser(),
                "Registration Approved",
                "Your registration for "
                        + registration.getEvent().getEventTitle()
                        + " has been approved.",
                "REGISTRATION"
        );

        // Notify the admin/faculty who approved
        User currentUser = getCurrentUser();
        if (currentUser != null && !currentUser.getId().equals(registration.getUser().getId())) {
            notificationService.createNotificationWithType(
                    currentUser,
                    "Registration Approved",
                    "You approved registration of "
                            + registration.getUser().getFullName()
                            + " for event '" + registration.getEvent().getEventTitle() + "'.",
                    "REGISTRATION"
            );
        }

        // Send approval email
        emailService.sendRegistrationApproved(registration.getUser(), registration.getEvent());

        return updatedRegistration;
    }

    // ==========================
    // Reject Registration
    // ==========================
    public Registration rejectRegistration(Long id) {

        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registration.setStatus("Rejected");

        Registration updatedRegistration = registrationRepository.save(registration);

        // Notify the student
        notificationService.createNotificationWithType(
                registration.getUser(),
                "Registration Rejected",
                "Your registration for "
                        + registration.getEvent().getEventTitle()
                        + " has been rejected.",
                "REGISTRATION"
        );

        // Notify the admin/faculty who rejected
        User currentUser = getCurrentUser();
        if (currentUser != null && !currentUser.getId().equals(registration.getUser().getId())) {
            notificationService.createNotificationWithType(
                    currentUser,
                    "Registration Rejected",
                    "You rejected registration of "
                            + registration.getUser().getFullName()
                            + " for event '" + registration.getEvent().getEventTitle() + "'.",
                    "REGISTRATION"
            );
        }

        // Send rejection email
        emailService.sendRegistrationRejected(registration.getUser(), registration.getEvent());

        return updatedRegistration;
    }

    // ==========================
    // Cancel Registration
    // ==========================
    public Registration cancelRegistration(Long id) {

        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registration.setStatus("Cancelled");

        Registration updatedRegistration = registrationRepository.save(registration);

        notificationService.createNotificationWithType(
                registration.getUser(),
                "Registration Cancelled",
                "Your registration for "
                        + registration.getEvent().getEventTitle()
                        + " has been cancelled.",
                "REGISTRATION"
        );

        return updatedRegistration;
    }

    // ==========================
    // Mark Attendance
    // ==========================
    public Registration markAttendance(Long id, String status) {

        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registration.setAttendanceStatus(status);

        return registrationRepository.save(registration);
    }

    // ==========================
    // Get Registration By ID
    // ==========================
    public Registration getRegistrationById(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }
}