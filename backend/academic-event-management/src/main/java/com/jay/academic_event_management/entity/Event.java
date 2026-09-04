package com.jay.academic_event_management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "events", indexes = {
        @Index(name = "idx_event_date", columnList = "event_date"),
        @Index(name = "idx_event_status", columnList = "status")
})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Event title is required")
    @Column(nullable = false)
    private String eventTitle;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, length = 1000)
    private String description;

    @NotNull(message = "Event date is required")
    @Column(nullable = false)
    private LocalDate eventDate;

    @NotNull(message = "Event time is required")
    @Column(nullable = false)
    private LocalTime eventTime;

    @NotNull(message = "Registration deadline is required")
    @Column(nullable = false)
    private LocalDate registrationDeadline;

    @NotNull(message = "Maximum participants is required")
    @Min(value = 1, message = "Maximum participants must be at least 1")
    @Column(nullable = false)
    private Integer maxParticipants;

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status;

    @NotNull(message = "Payment required field is mandatory")
    @Column(nullable = false)
    private Boolean paymentRequired;

    @NotNull(message = "Registration fee is required")
    @PositiveOrZero(message = "Registration fee cannot be negative")
    @Column(nullable = false)
    private Double registrationFee;

    private String bannerImage;

    @NotNull(message = "Quiz required field is mandatory")
    @Column(nullable = false)
    private Boolean quizRequired;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @NotBlank(message = "Faculty Coordinator Name is required")
    @Column(nullable = false)
    private String facultyCoordinatorName;

    @NotBlank(message = "Faculty Coordinator Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false)
    private String facultyCoordinatorEmail;

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private EventCategory category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}