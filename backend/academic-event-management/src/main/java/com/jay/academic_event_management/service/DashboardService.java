package com.jay.academic_event_management.service;

import com.jay.academic_event_management.dto.DashboardResponse;
import com.jay.academic_event_management.entity.*;
import com.jay.academic_event_management.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final CertificateRepository certificateRepository;
    private final FeedbackRepository feedbackRepository;
    private final PaymentRepository paymentRepository;

    public DashboardService(UserRepository userRepository,
                            EventRepository eventRepository,
                            RegistrationRepository registrationRepository,
                            CertificateRepository certificateRepository,
                            FeedbackRepository feedbackRepository,
                            PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.certificateRepository = certificateRepository;
        this.feedbackRepository = feedbackRepository;
        this.paymentRepository = paymentRepository;
    }

    public DashboardResponse getAdminDashboard() {

        DashboardResponse response = new DashboardResponse();

        // ========================
        // USER STATISTICS (aggregate queries)
        // ========================
        response.setTotalUsers(userRepository.countAll());
        response.setTotalStudents(userRepository.countStudents());
        response.setTotalFaculty(userRepository.countFaculty());

        // ========================
        // EVENT STATISTICS (must load events for status calculation)
        // ========================
        List<Event> allEvents = eventRepository.findAll();
        LocalDate today = LocalDate.now();

        long upcomingCount = 0;
        long ongoingCount = 0;
        long completedCount = 0;
        long cancelledCount = 0;

        List<Event> eventsToUpdate = new ArrayList<>();

        for (Event event : allEvents) {
            String effectiveStatus = calculateEventStatus(event, today);

            if ("Upcoming".equalsIgnoreCase(effectiveStatus)) {
                upcomingCount++;
            } else if ("Ongoing".equalsIgnoreCase(effectiveStatus)) {
                ongoingCount++;
            } else if ("Completed".equalsIgnoreCase(effectiveStatus)) {
                completedCount++;
            } else if ("Cancelled".equalsIgnoreCase(effectiveStatus)) {
                cancelledCount++;
            }

            if (!effectiveStatus.equalsIgnoreCase(event.getStatus())) {
                event.setStatus(effectiveStatus);
                eventsToUpdate.add(event);
            }
        }

        if (!eventsToUpdate.isEmpty()) {
            eventRepository.saveAll(eventsToUpdate);
        }

        response.setTotalEvents((long) allEvents.size());
        response.setUpcomingEvents(upcomingCount);
        response.setOngoingEvents(ongoingCount);
        response.setCompletedEvents(completedCount);
        response.setCancelledEvents(cancelledCount);

        // ========================
        // REGISTRATION STATISTICS (aggregate queries)
        // ========================
        response.setTotalRegistrations(registrationRepository.countAll());
        response.setApprovedRegistrations(registrationRepository.countByStatus("Approved"));
        response.setPendingRegistrations(registrationRepository.countByStatus("Pending"));
        response.setRejectedRegistrations(registrationRepository.countByStatus("Rejected"));
        response.setCancelledRegistrations(registrationRepository.countByCancelled());

        // ========================
        // PAYMENT STATISTICS (aggregate queries)
        // ========================
        response.setTotalPayments(paymentRepository.countAll());
        response.setTotalRevenue(paymentRepository.sumSuccessfulRevenue());
        response.setSuccessfulPayments(paymentRepository.countByStatus("SUCCESS"));
        response.setPendingPayments(paymentRepository.countByStatus("PENDING"));

        // ========================
        // CERTIFICATE STATISTICS
        // ========================
        response.setTotalCertificates(certificateRepository.count());

        // ========================
        // ATTENDANCE STATISTICS (aggregate queries)
        // ========================
        response.setTotalAttended(registrationRepository.countByAttendanceStatus("PRESENT"));
        response.setTotalAbsent(registrationRepository.countByAttendanceStatus("ABSENT"));

        // ========================
        // FEEDBACK STATISTICS
        // ========================
        response.setTotalFeedback(feedbackRepository.getTotalFeedbackCount());
        Double avgRating = feedbackRepository.getOverallAverageRating();
        response.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);

        // ========================
        // EVENTS BY CATEGORY (for pie chart - needs events for category info)
        // ========================
        List<Map<String, Object>> categoryData = allEvents.stream()
                .filter(e -> e.getCategory() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().getCategoryName(),
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        response.setEventsByCategory(categoryData);

        // ========================
        // MONTHLY EVENTS (for area chart - last 6 months)
        // ========================
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth month = YearMonth.now().minusMonths(i);
            long count = allEvents.stream()
                    .filter(e -> {
                        if (e.getEventDate() == null) return false;
                        YearMonth eventMonth = YearMonth.from(e.getEventDate());
                        return eventMonth.equals(month);
                    })
                    .count();

            Map<String, Object> map = new HashMap<>();
            map.put("name", month.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, Locale.ENGLISH));
            map.put("events", count);
            monthlyData.add(map);
        }
        response.setMonthlyEvents(monthlyData);

        return response;
    }

    /**
     * Calculate effective event status based on event date.
     * Cancelled status is always preserved.
     */
    private String calculateEventStatus(Event event, LocalDate today) {
        if ("Cancelled".equalsIgnoreCase(event.getStatus())) {
            return "Cancelled";
        }

        LocalDate eventDate = event.getEventDate();
        if (eventDate == null) {
            return event.getStatus() != null ? event.getStatus() : "Upcoming";
        }

        if (eventDate.isAfter(today)) {
            return "Upcoming";
        } else if (eventDate.isEqual(today)) {
            return "Ongoing";
        } else {
            return "Completed";
        }
    }
}
