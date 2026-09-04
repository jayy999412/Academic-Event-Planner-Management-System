package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // Search Event by Title
    List<Event> findByEventTitleContainingIgnoreCase(String eventTitle);

}