package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.EventGallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventGalleryRepository extends JpaRepository<EventGallery, Long> {

    List<EventGallery> findByEventId(Long eventId);

    void deleteAllByEventId(Long eventId);

}