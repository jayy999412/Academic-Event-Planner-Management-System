package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByEventTitleContainingIgnoreCase(String eventTitle);

    List<Event> findByEventDate(LocalDate eventDate);

}