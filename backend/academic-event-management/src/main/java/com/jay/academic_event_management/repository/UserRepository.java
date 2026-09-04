package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    @Query("SELECT COUNT(u) FROM User u")
    long countAll();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role IS NOT NULL AND UPPER(u.role.roleName) = 'STUDENT'")
    long countStudents();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role IS NOT NULL AND UPPER(u.role.roleName) = 'FACULTY'")
    long countFaculty();

    @Query("SELECT u FROM User u WHERE u.role IS NOT NULL AND UPPER(u.role.roleName) = 'STUDENT'")
    List<User> findAllStudents();
}