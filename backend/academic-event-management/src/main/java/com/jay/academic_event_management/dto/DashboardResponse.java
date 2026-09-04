package com.jay.academic_event_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    // User Statistics
    private Long totalUsers;
    private Long totalStudents;
    private Long totalFaculty;

    // Event Statistics
    private Long totalEvents;
    private Long upcomingEvents;
    private Long ongoingEvents;
    private Long completedEvents;
    private Long cancelledEvents;

    // Registration Statistics
    private Long totalRegistrations;
    private Long approvedRegistrations;
    private Long pendingRegistrations;
    private Long rejectedRegistrations;
    private Long cancelledRegistrations;

    // Payment Statistics
    private Long totalPayments;
    private Double totalRevenue;
    private Long successfulPayments;
    private Long pendingPayments;

    // Certificate Statistics
    private Long totalCertificates;

    // Attendance Statistics
    private Long totalAttended;
    private Long totalAbsent;

    // Feedback Statistics
    private Long totalFeedback;
    private Double averageRating;

    // Event Category Distribution
    private List<Map<String, Object>> eventsByCategory;

    // Monthly Events (for chart)
    private List<Map<String, Object>> monthlyEvents;
}
