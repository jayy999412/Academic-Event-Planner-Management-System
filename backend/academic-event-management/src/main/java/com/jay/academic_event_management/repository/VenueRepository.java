package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long> {

}