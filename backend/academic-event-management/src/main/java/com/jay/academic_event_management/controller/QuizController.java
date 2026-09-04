package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.Quiz;
import com.jay.academic_event_management.service.QuizService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // ==========================
    // Create Quiz
    // ==========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Quiz createQuiz(@RequestBody Quiz quiz) {

        System.out.println("======================================");
        System.out.println("CREATE QUIZ API HIT");
        System.out.println("Title : " + quiz.getQuizTitle());
        System.out.println("Marks : " + quiz.getTotalMarks());
        System.out.println("Event : " +
                (quiz.getEvent() != null ? quiz.getEvent().getId() : "NULL"));
        System.out.println("======================================");

        try {

            Quiz savedQuiz = quizService.saveQuiz(quiz);

            System.out.println("Quiz Saved Successfully");
            System.out.println("Quiz ID : " + savedQuiz.getId());

            return savedQuiz;

        } catch (Exception e) {

            System.out.println("ERROR SAVING QUIZ");
            e.printStackTrace();

            throw e;
        }
    }

    // ==========================
    // Get All Quizzes
    // ==========================
    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuiz();
    }

    // ==========================
    // Get Quiz By ID
    // ==========================
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    // ==========================
    // Get Quiz By Event
    // ==========================
    @GetMapping("/event/{eventId}")
    public List<Quiz> getQuizByEvent(@PathVariable Long eventId) {
        return quizService.getQuizByEvent(eventId);
    }

    // ==========================
    // Update Quiz
    // ==========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Quiz updateQuiz(@PathVariable Long id,
                           @RequestBody Quiz quiz) {
        return quizService.updateQuiz(id, quiz);
    }

    // ==========================
    // Delete Quiz
    // ==========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
    }
}