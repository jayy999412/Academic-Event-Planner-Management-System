package com.jay.academic_event_management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="venues")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Venue name is required")
    @Column(nullable=false)
    private String venueName;

    @NotBlank(message="Building name is required")
    @Column(nullable=false)
    private String building;

    @NotBlank(message="Floor is required")
    @Column(nullable=false)
    private String floor;

    @NotNull(message="Capacity is required")
    @Min(1)
    @Column(nullable=false)
    private Integer capacity;

    @NotBlank(message="Venue type is required")
    @Column(nullable=false)
    private String venueType;

    @Column(length = 500)
    private String facilities;

    @Column(nullable = false)
    private Boolean available;
}