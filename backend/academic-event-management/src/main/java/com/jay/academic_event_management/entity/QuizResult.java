package com.jay.academic_event_management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "quiz_results")
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Quiz
    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer totalMarks;

    @Column(nullable = false)
    private Double percentage;

    @Column(nullable = false)
    private String status;

    // Result Published or Not
    @Column(nullable = false)
    private Boolean published = false;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    public void prePersist() {
        submittedAt = LocalDateTime.now();

        if (published == null) {
            published = false;
        }
    }
}