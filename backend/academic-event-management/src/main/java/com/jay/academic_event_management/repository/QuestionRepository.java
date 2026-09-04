package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuizId(Long quizId);

    void deleteAllByQuizEventId(Long eventId);

}