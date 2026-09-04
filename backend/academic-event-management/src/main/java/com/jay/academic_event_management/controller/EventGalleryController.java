package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.Event;
import com.jay.academic_event_management.entity.EventGallery;
import com.jay.academic_event_management.file.FileStorageService;
import com.jay.academic_event_management.repository.EventRepository;
import com.jay.academic_event_management.service.EventGalleryService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class EventGalleryController {

    private final EventGalleryService galleryService;
    private final EventRepository eventRepository;
    private final FileStorageService fileStorageService;

    public EventGalleryController(
            EventGalleryService galleryService,
            EventRepository eventRepository,
            FileStorageService fileStorageService) {

        this.galleryService = galleryService;
        this.eventRepository = eventRepository;
        this.fileStorageService = fileStorageService;
    }

    // Upload Images (Admin only)
    @PostMapping("/upload/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadGallery(
            @PathVariable Long eventId,
            @RequestParam("files") MultipartFile[] files) {

        try {

            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event Not Found"));

            for (MultipartFile file : files) {

                String fileName = fileStorageService.saveFile(file);

                EventGallery gallery = new EventGallery();
                gallery.setImagePath(fileName);
                gallery.setEvent(event);

                galleryService.save(gallery);
            }

            return ResponseEntity.ok("Gallery Uploaded Successfully");

        } catch (IOException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(e.getMessage());

        }
    }

    // View Gallery
    @GetMapping("/{eventId}")
    public List<EventGallery> getGallery(@PathVariable Long eventId) {
        return galleryService.getByEvent(eventId);
    }

    // Delete Image (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {

        galleryService.delete(id);

        return ResponseEntity.ok("Image Deleted Successfully");
    }

}