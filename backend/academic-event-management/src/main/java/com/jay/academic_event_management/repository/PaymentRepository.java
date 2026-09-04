package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByRegistrationUserId(Long userId);

    Optional<Payment> findByRegistrationId(Long registrationId);

    @Query("SELECT COUNT(p) FROM Payment p")
    long countAll();

    @Query("SELECT COUNT(p) FROM Payment p WHERE UPPER(p.paymentStatus) = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE UPPER(p.paymentStatus) = 'SUCCESS'")
    Double sumSuccessfulRevenue();

    void deleteAllByRegistrationEventId(Long eventId);
}