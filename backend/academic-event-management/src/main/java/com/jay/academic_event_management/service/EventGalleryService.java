package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.EventGallery;
import com.jay.academic_event_management.repository.EventGalleryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventGalleryService {

    private final EventGalleryRepository repository;

    public EventGalleryService(EventGalleryRepository repository) {
        this.repository = repository;
    }

    public EventGallery save(EventGallery gallery) {
        return repository.save(gallery);
    }

    public List<EventGallery> getByEvent(Long eventId) {
        return repository.findByEventId(eventId);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

}