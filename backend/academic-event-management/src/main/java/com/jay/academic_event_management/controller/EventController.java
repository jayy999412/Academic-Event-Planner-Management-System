package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.Event;
import com.jay.academic_event_management.file.FileStorageService;
import com.jay.academic_event_management.service.EventService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final FileStorageService fileStorageService;

    public EventController(EventService eventService, FileStorageService fileStorageService) {
        this.eventService = eventService;
        this.fileStorageService = fileStorageService;
    }

    // Create Event
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Event createEvent(@Valid @RequestBody Event event) {
        return eventService.saveEvent(event);
    }

    // Update Event
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Event updateEvent(
            @PathVariable Long id,
            @RequestBody Event event) {

        return eventService.updateEvent(id, event);
    }

    // Get All Events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Get Completed Events
    @GetMapping("/completed")
    public List<Event> getCompletedEvents() {
        return eventService.getCompletedEvents();
    }

    // Get Event By ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    // Delete Event
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    // Search Event
    @GetMapping("/search")
    public List<Event> searchEvents(@RequestParam String keyword) {
        return eventService.searchEvents(keyword);
    }

    // Pagination
    @GetMapping("/page")
    public Page<Event> getEventsByPage(
            @RequestParam int page,
            @RequestParam int size) {

        return eventService.getEventsByPage(page, size);
    }

    // Sorting
    @GetMapping("/sort")
    public List<Event> getEventsSorted(@RequestParam String field) {
        return eventService.getEventsSorted(field);
    }

    // Upload Banner
  @PostMapping("/uploadBanner")
  @PreAuthorize("hasRole('ADMIN')")
public String uploadBanner(
        @RequestParam("file") MultipartFile file)
        throws IOException {

    return fileStorageService.saveFile(file);
}
}