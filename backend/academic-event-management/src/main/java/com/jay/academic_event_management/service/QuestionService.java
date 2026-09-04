package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Question;
import com.jay.academic_event_management.entity.Quiz;
import com.jay.academic_event_management.repository.QuestionRepository;
import com.jay.academic_event_management.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    public QuestionService(QuestionRepository questionRepository,
                           QuizRepository quizRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
    }

    // Create Question
    public Question save(Question question) {

        Long quizId = question.getQuiz().getId();

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz Not Found"));

        question.setQuiz(quiz);

        return questionRepository.save(question);
    }

    // Get All Questions
    public List<Question> getAll() {
        return questionRepository.findAll();
    }

    // Get Question By Id
    public Question getById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    // Get Questions By Quiz
    public List<Question> getByQuiz(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }

    // Update Question
    public Question update(Long id, Question updatedQuestion) {

        Question question = questionRepository.findById(id).orElse(null);

        if (question == null) {
            return null;
        }

        question.setQuestion(updatedQuestion.getQuestion());
        question.setOptionA(updatedQuestion.getOptionA());
        question.setOptionB(updatedQuestion.getOptionB());
        question.setOptionC(updatedQuestion.getOptionC());
        question.setOptionD(updatedQuestion.getOptionD());
        question.setCorrectAnswer(updatedQuestion.getCorrectAnswer());
        question.setMarks(updatedQuestion.getMarks());

        Quiz quiz = quizRepository.findById(updatedQuestion.getQuiz().getId())
                .orElseThrow(() -> new RuntimeException("Quiz Not Found"));

        question.setQuiz(quiz);

        return questionRepository.save(question);
    }

    // Delete Question
    public void delete(Long id) {
        questionRepository.deleteById(id);
    }
}