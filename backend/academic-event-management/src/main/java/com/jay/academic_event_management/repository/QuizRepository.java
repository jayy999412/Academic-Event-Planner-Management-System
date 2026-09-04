package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByEventId(Long eventId);

    void deleteAllByEventId(Long eventId);

}