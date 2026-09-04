package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByUserId(Long userId);

    List<Registration> findByEventId(Long eventId);

    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.id = :eventId")
    long countByEventId(@Param("eventId") Long eventId);

    @Query("SELECT COUNT(r) FROM Registration r")
    long countAll();

    @Query("SELECT COUNT(r) FROM Registration r WHERE UPPER(r.status) = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT COUNT(r) FROM Registration r WHERE UPPER(r.attendanceStatus) = :attendanceStatus")
    long countByAttendanceStatus(@Param("attendanceStatus") String attendanceStatus);

    @Query("SELECT COUNT(r) FROM Registration r WHERE UPPER(r.status) = 'CANCELLED'")
    long countByCancelled();

    void deleteAllByEventId(Long eventId);
}