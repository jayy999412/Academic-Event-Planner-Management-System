package com.jay.academic_event_management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Question is required")
    @Column(nullable = false, length = 1000)
    private String question;

    @NotBlank
    @Column(nullable = false)
    private String optionA;

    @NotBlank
    @Column(nullable = false)
    private String optionB;

    @NotBlank
    @Column(nullable = false)
    private String optionC;

    @NotBlank
    @Column(nullable = false)
    private String optionD;

    @NotBlank
    @Column(nullable = false)
    private String correctAnswer;

    @NotNull
    @Column(nullable = false)
    private Integer marks;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
}