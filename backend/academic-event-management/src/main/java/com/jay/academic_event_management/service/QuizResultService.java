package com.jay.academic_event_management.service;

import com.jay.academic_event_management.dto.AnswerRequest;
import com.jay.academic_event_management.dto.QuizResultResponse;
import com.jay.academic_event_management.dto.QuizSubmissionRequest;
import com.jay.academic_event_management.entity.Question;
import com.jay.academic_event_management.entity.Quiz;
import com.jay.academic_event_management.entity.QuizResult;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.repository.QuestionRepository;
import com.jay.academic_event_management.repository.QuizRepository;
import com.jay.academic_event_management.repository.QuizResultRepository;
import com.jay.academic_event_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizResultService {

    private final QuizResultRepository repository;
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public QuizResultService(
            QuizResultRepository repository,
            QuestionRepository questionRepository,
            QuizRepository quizRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.repository = repository;
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // ============================
    // Save Result
    // ============================

    public QuizResult save(QuizResult result) {
        return repository.save(result);
    }

    // ============================
    // Get All Results
    // ============================

    public List<QuizResult> getAll() {
        return repository.findAll();
    }

    // ============================
    // Get Student Results
    // ============================

    public List<QuizResult> getByStudent(Long studentId) {
        return repository.findByUserId(studentId);
    }

    // ============================
    // Get Quiz Results
    // ============================

    public List<QuizResult> getByQuiz(Long quizId) {
        return repository.findByQuizId(quizId);
    }

    // ============================
    // Get Published Results
    // ============================

    public List<QuizResult> getPublishedResults() {
        return repository.findByPublishedTrue();
    }

    public List<QuizResult> getPublishedResultsByQuiz(Long quizId) {
        return repository.findByQuizIdAndPublishedTrue(quizId);
    }

    public List<QuizResult> getPublishedResultsByStudent(Long studentId) {
        return repository.findByUserIdAndPublishedTrue(studentId);
    }

    // ============================
    // Publish Result
    // ============================

    public QuizResult publishResult(Long resultId) {

        QuizResult result = repository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        result.setPublished(true);

        QuizResult saved = repository.save(result);

        // ============================
        // Create Result Published Notification
        // ============================
        notificationService.createNotificationWithType(
                result.getUser(),
                "Quiz Result Published",
                "Your result for quiz '"
                        + result.getQuiz().getQuizTitle()
                        + "' has been published. Score: "
                        + result.getScore() + "/" + result.getTotalMarks()
                        + " (" + result.getStatus() + ")",
                "GENERAL"
        );

        return saved;
    }

    // ============================
    // Submit Quiz (Auto Result)
    // ============================

    public QuizResultResponse submitQuiz(QuizSubmissionRequest request) {

        List<Question> questions =
                questionRepository.findByQuizId(request.getQuizId());

        int score = 0;
        int totalMarks = 0;

        for (Question question : questions) {

            totalMarks += question.getMarks();

            for (AnswerRequest answer : request.getAnswers()) {

                if (question.getId().equals(answer.getQuestionId())) {

                    if (question.getCorrectAnswer()
                            .equalsIgnoreCase(answer.getSelectedAnswer())) {

                        score += question.getMarks();
                    }
                }
            }
        }

        double percentage = totalMarks == 0
                ? 0
                : ((double) score / totalMarks) * 100;

        String status = percentage >= 40 ? "PASS" : "FAIL";

        Quiz quiz =
                quizRepository.findById(request.getQuizId())
                        .orElseThrow(() -> new RuntimeException("Quiz not found"));

        User user =
                userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found"));

        QuizResult result = new QuizResult();

        result.setQuiz(quiz);
        result.setUser(user);
        result.setScore(score);
        result.setTotalMarks(totalMarks);
        result.setPercentage(percentage);
        result.setStatus(status);

        // Result is hidden until published
        result.setPublished(false);

        repository.save(result);

        return new QuizResultResponse(
                score,
                totalMarks,
                percentage,
                status
        );
    }
}