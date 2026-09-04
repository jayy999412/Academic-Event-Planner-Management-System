package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Feedback;
import com.jay.academic_event_management.entity.Registration;
import com.jay.academic_event_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByRegistrationUserOrderByFeedbackDateDesc(User user);

    List<Feedback> findByRegistrationEventIdOrderByFeedbackDateDesc(Long eventId);

    Optional<Feedback> findByRegistration(Registration registration);

    boolean existsByRegistration(Registration registration);

    long countByRegistrationEventId(Long eventId);

    long countByRegistrationUser(User user);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.registration.event.id = :eventId")
    Double getAverageRatingByEventId(@Param("eventId") Long eventId);

    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getOverallAverageRating();

    @Query("SELECT COUNT(f) FROM Feedback f")
    long getTotalFeedbackCount();

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.rating = :rating")
    long countByRating(@Param("rating") int rating);

    void deleteAllByRegistrationEventId(Long eventId);
}
