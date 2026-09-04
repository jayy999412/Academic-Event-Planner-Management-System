package com.jay.academic_event_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String certificateNumber;

    @Column(nullable = false)
    private LocalDate issueDate;

    @Column(nullable = false)
    private String certificateUrl;

    @Column(nullable = false)
    private String status;

    @OneToOne
    @JoinColumn(name = "registration_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Registration registration;

}
