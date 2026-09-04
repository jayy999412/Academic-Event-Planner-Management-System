package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    void deleteAllByRegistrationEventId(Long eventId);

}