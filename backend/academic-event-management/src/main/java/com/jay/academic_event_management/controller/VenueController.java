package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.Venue;
import com.jay.academic_event_management.service.VenueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @PostMapping
    public Venue addVenue(@RequestBody Venue venue){
        return venueService.saveVenue(venue);
    }

    @GetMapping
    public List<Venue> getAllVenues(){
        return venueService.getAllVenues();
    }

    @GetMapping("/{id}")
    public Venue getVenue(@PathVariable Long id){
        return venueService.getVenue(id);
    }

    @DeleteMapping("/{id}")
    public void deleteVenue(@PathVariable Long id){
        venueService.deleteVenue(id);
    }

}