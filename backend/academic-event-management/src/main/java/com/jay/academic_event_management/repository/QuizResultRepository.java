package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    // Results of a particular student
    List<QuizResult> findByUserId(Long userId);

    // Results of a particular quiz
    List<QuizResult> findByQuizId(Long quizId);

    // Published results of a student
    List<QuizResult> findByUserIdAndPublishedTrue(Long userId);

    // Published results of a quiz
    List<QuizResult> findByQuizIdAndPublishedTrue(Long quizId);

    // All published results
    List<QuizResult> findByPublishedTrue();

    void deleteAllByQuizEventId(Long eventId);
}