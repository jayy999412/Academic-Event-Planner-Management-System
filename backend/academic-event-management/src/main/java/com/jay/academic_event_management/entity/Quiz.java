package com.jay.academic_event_management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "quizzes")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Quiz title is required")
    @Column(nullable = false)
    private String quizTitle;

    @Column(length = 1000)
    private String description;

    @NotNull(message = "Total marks is required")
    @Column(nullable = false)
    private Integer totalMarks;

    @NotNull(message = "Passing marks is required")
    @Column(nullable = false)
    private Integer passingMarks;

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}