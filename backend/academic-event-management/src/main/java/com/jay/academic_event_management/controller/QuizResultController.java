package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.dto.QuizResultResponse;
import com.jay.academic_event_management.dto.QuizSubmissionRequest;
import com.jay.academic_event_management.entity.QuizResult;
import com.jay.academic_event_management.service.QuizResultService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class QuizResultController {

    private final QuizResultService service;

    public QuizResultController(QuizResultService service) {
        this.service = service;
    }

    // ==========================================
    // Submit Quiz
    // ==========================================

    @PostMapping("/submit")
    public QuizResultResponse submitQuiz(
            @RequestBody QuizSubmissionRequest request
    ) {
        return service.submitQuiz(request);
    }

    // ==========================================
    // Save Result
    // ==========================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public QuizResult save(@RequestBody QuizResult result) {
        return service.save(result);
    }

    // ==========================================
    // Get All Results
    // ==========================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<QuizResult> getAll() {
        return service.getAll();
    }

    // ==========================================
    // Get Results By Student
    // ==========================================

    @GetMapping("/student/{id}")
    public List<QuizResult> getStudentResults(@PathVariable Long id) {
        return service.getByStudent(id);
    }

    // ==========================================
    // Get Results By Quiz
    // ==========================================

    @GetMapping("/quiz/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<QuizResult> getQuizResults(@PathVariable Long id) {
        return service.getByQuiz(id);
    }

    // ==========================================
    // Publish Result
    // ==========================================

    @PutMapping("/publish/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public QuizResult publishResult(@PathVariable Long id) {
        return service.publishResult(id);
    }

    // ==========================================
    // Get Published Results
    // ==========================================

    @GetMapping("/published")
    public List<QuizResult> getPublishedResults() {
        return service.getPublishedResults();
    }

    // ==========================================
    // Get Published Results By Quiz
    // ==========================================

    @GetMapping("/published/quiz/{quizId}")
    public List<QuizResult> getPublishedResultsByQuiz(
            @PathVariable Long quizId
    ) {
        return service.getPublishedResultsByQuiz(quizId);
    }

    // ==========================================
    // Get Published Results By Student
    // ==========================================

    @GetMapping("/published/student/{studentId}")
    public List<QuizResult> getPublishedResultsByStudent(
            @PathVariable Long studentId
    ) {
        return service.getPublishedResultsByStudent(studentId);
    }
}