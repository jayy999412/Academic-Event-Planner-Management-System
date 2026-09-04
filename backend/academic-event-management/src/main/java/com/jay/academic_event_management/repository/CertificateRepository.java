package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByRegistrationId(Long registrationId);

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    void deleteAllByRegistrationEventId(Long eventId);

}