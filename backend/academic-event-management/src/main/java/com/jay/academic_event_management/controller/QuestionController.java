package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.Question;
import com.jay.academic_event_management.service.QuestionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Question save(@RequestBody Question question) {
        return questionService.save(question);
    }

    @GetMapping
    public List<Question> getAll() {
        return questionService.getAll();
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable Long id) {
        return questionService.getById(id);
    }

    @GetMapping("/quiz/{quizId}")
    public List<Question> getByQuiz(@PathVariable Long quizId) {
        return questionService.getByQuiz(quizId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Question update(
            @PathVariable Long id,
            @RequestBody Question question) {

        return questionService.update(id, question);

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        questionService.delete(id);
    }

}