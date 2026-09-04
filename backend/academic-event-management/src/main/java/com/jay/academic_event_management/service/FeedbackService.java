package com.jay.academic_event_management.service;

import com.jay.academic_event_management.dto.FeedbackRequest;
import com.jay.academic_event_management.dto.FeedbackResponse;
import com.jay.academic_event_management.dto.FeedbackStats;
import com.jay.academic_event_management.entity.Feedback;
import com.jay.academic_event_management.entity.Registration;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.repository.FeedbackRepository;
import com.jay.academic_event_management.repository.RegistrationRepository;
import com.jay.academic_event_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           UserRepository userRepository,
                           RegistrationRepository registrationRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
    }

    // =====================================
    // Submit Feedback
    // =====================================

    public FeedbackResponse submitFeedback(FeedbackRequest request) {

        Registration registration = registrationRepository
                .findByUserIdAndEventId(request.getUserId(), request.getEventId())
                .orElseThrow(() -> new RuntimeException("Registration not found for this event"));

        if (!"Present".equalsIgnoreCase(registration.getAttendanceStatus())) {
            throw new RuntimeException("You can only submit feedback after attending the event.");
        }

        if (feedbackRepository.existsByRegistration(registration)) {
            throw new RuntimeException("You have already submitted feedback for this event.");
        }

        Feedback feedback = new Feedback();
        feedback.setRegistration(registration);
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());

        feedback = feedbackRepository.save(feedback);

        return convertToResponse(feedback);
    }

    // =====================================
    // Check if user can give feedback
    // =====================================

    public boolean canUserGiveFeedback(Long userId, Long eventId) {

        return registrationRepository.findByUserIdAndEventId(userId, eventId)
                .map(reg -> {
                    if (!"Present".equalsIgnoreCase(reg.getAttendanceStatus())) {
                        return false;
                    }
                    return !feedbackRepository.existsByRegistration(reg);
                })
                .orElse(false);
    }

    // =====================================
    // Get All Feedback
    // =====================================

    public List<FeedbackResponse> getAllFeedback() {
        return feedbackRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // =====================================
    // Get Feedback By User
    // =====================================

    public List<FeedbackResponse> getFeedbackByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return feedbackRepository.findByRegistrationUserOrderByFeedbackDateDesc(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // =====================================
    // Get Feedback By Event
    // =====================================

    public List<FeedbackResponse> getFeedbackByEvent(Long eventId) {
        return feedbackRepository.findByRegistrationEventIdOrderByFeedbackDateDesc(eventId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // =====================================
    // Get Average Rating For Event
    // =====================================

    public double getAverageRatingByEvent(Long eventId) {
        Double avg = feedbackRepository.getAverageRatingByEventId(eventId);
        return avg != null ? avg : 0.0;
    }

    // =====================================
    // Get Feedback Count For Event
    // =====================================

    public long getFeedbackCountByEvent(Long eventId) {
        return feedbackRepository.countByRegistrationEventId(eventId);
    }

    // =====================================
    // Get Feedback Stats (Admin)
    // =====================================

    public FeedbackStats getFeedbackStats() {

        FeedbackStats stats = new FeedbackStats();

        stats.setTotalFeedback(feedbackRepository.getTotalFeedbackCount());

        Double avg = feedbackRepository.getOverallAverageRating();
        stats.setAverageRating(avg != null ? avg : 0.0);

        // Use COUNT queries instead of loading all feedback into memory
        stats.setFiveStarCount(feedbackRepository.countByRating(5));
        stats.setFourStarCount(feedbackRepository.countByRating(4));
        stats.setThreeStarCount(feedbackRepository.countByRating(3));
        stats.setTwoStarCount(feedbackRepository.countByRating(2));
        stats.setOneStarCount(feedbackRepository.countByRating(1));

        return stats;
    }

    // =====================================
    // Delete Feedback
    // =====================================

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    // =====================================
    // Average Rating
    // =====================================

    public double getAverageRating() {
        Double avg = feedbackRepository.getOverallAverageRating();
        return avg != null ? avg : 0.0;
    }

    // =====================================
    // Convert Entity -> DTO
    // =====================================

    private FeedbackResponse convertToResponse(Feedback feedback) {

        Registration reg = feedback.getRegistration();

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .userName(reg.getUser().getFullName())
                .eventTitle(reg.getEvent().getEventTitle())
                .rating(feedback.getRating())
                .comments(feedback.getComments())
                .feedbackDate(feedback.getFeedbackDate())
                .build();
    }
}
