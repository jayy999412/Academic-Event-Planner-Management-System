package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Venue;
import com.jay.academic_event_management.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository repository;

    public VenueService(VenueRepository repository) {
        this.repository = repository;
    }

    public Venue saveVenue(Venue venue) {
        return repository.save(venue);
    }

    public List<Venue> getAllVenues() {
        return repository.findAll();
    }

    public Venue getVenue(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteVenue(Long id) {
        repository.deleteById(id);
    }

}