package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.dto.DashboardResponse;
import com.jay.academic_event_management.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // Admin Dashboard - comprehensive statistics
    @GetMapping("/admin")
    public DashboardResponse getAdminDashboard() {
        return dashboardService.getAdminDashboard();
    }
}
