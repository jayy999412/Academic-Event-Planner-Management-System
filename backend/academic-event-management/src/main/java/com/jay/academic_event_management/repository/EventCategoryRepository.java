package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventCategoryRepository extends JpaRepository<EventCategory, Long> {

}