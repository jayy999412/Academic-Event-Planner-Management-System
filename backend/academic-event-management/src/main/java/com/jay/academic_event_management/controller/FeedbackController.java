package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.dto.FeedbackRequest;
import com.jay.academic_event_management.dto.FeedbackResponse;
import com.jay.academic_event_management.dto.FeedbackStats;
import com.jay.academic_event_management.service.FeedbackService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // =========================================
    // Submit Feedback
    // =========================================

    @PostMapping
    public FeedbackResponse submitFeedback(
            @RequestBody FeedbackRequest request) {

        return feedbackService.submitFeedback(request);
    }

    // =========================================
    // Get All Feedback
    // =========================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<FeedbackResponse> getAllFeedback() {

        return feedbackService.getAllFeedback();
    }

    // =========================================
    // Get Feedback Of Particular User
    // =========================================

    @GetMapping("/user/{userId}")
    public List<FeedbackResponse> getFeedbackByUser(
            @PathVariable Long userId) {

        return feedbackService.getFeedbackByUser(userId);
    }

    // =========================================
    // Get Feedback For Event
    // =========================================

    @GetMapping("/event/{eventId}")
    public List<FeedbackResponse> getFeedbackByEvent(
            @PathVariable Long eventId) {

        return feedbackService.getFeedbackByEvent(eventId);
    }

    // =========================================
    // Check if user can give feedback
    // =========================================

    @GetMapping("/can-feedback/{userId}/{eventId}")
    public boolean canUserGiveFeedback(
            @PathVariable Long userId,
            @PathVariable Long eventId) {

        return feedbackService.canUserGiveFeedback(userId, eventId);
    }

    // =========================================
    // Get Average Rating For Event
    // =========================================

    @GetMapping("/event/{eventId}/average-rating")
    public double getAverageRatingByEvent(
            @PathVariable Long eventId) {

        return feedbackService.getAverageRatingByEvent(eventId);
    }

    // =========================================
    // Get Feedback Count For Event
    // =========================================

    @GetMapping("/event/{eventId}/count")
    public long getFeedbackCountByEvent(
            @PathVariable Long eventId) {

        return feedbackService.getFeedbackCountByEvent(eventId);
    }

    // =========================================
    // Get Feedback Stats (Admin)
    // =========================================

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public FeedbackStats getFeedbackStats() {

        return feedbackService.getFeedbackStats();
    }

    // =========================================
    // Delete Feedback
    // =========================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteFeedback(
            @PathVariable Long id) {

        feedbackService.deleteFeedback(id);

        return "Feedback Deleted Successfully";
    }

    // =========================================
    // Average Rating (Overall)
    // =========================================

    @GetMapping("/average-rating")
    public double averageRating() {

        return feedbackService.getAverageRating();
    }
}
