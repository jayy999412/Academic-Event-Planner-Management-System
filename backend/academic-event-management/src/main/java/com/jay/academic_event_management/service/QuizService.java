package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Quiz;
import com.jay.academic_event_management.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    // Create Quiz
    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    // Get All Quiz
    public List<Quiz> getAllQuiz() {
        return quizRepository.findAll();
    }

    // Get Quiz By Id
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElse(null);
    }

    // Get Quiz By Event
    public List<Quiz> getQuizByEvent(Long eventId) {
        return quizRepository.findByEventId(eventId);
    }

    // Update Quiz
    public Quiz updateQuiz(Long id, Quiz updatedQuiz) {

        Quiz quiz = quizRepository.findById(id).orElse(null);

        if (quiz != null) {

            quiz.setQuizTitle(updatedQuiz.getQuizTitle());
            quiz.setDescription(updatedQuiz.getDescription());
            quiz.setTotalMarks(updatedQuiz.getTotalMarks());
            quiz.setPassingMarks(updatedQuiz.getPassingMarks());
            quiz.setStatus(updatedQuiz.getStatus());
            quiz.setEvent(updatedQuiz.getEvent());

            return quizRepository.save(quiz);
        }

        return null;
    }

    // Delete Quiz
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

}