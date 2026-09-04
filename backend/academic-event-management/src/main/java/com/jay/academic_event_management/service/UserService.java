package com.jay.academic_event_management.service;

import com.jay.academic_event_management.dto.ChangePasswordRequest;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // Save User
    // ==========================================

    public User saveUser(User user) {

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Encrypt Password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // ==========================================
    // Get All Users
    // ==========================================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ==========================================
    // Get User By ID
    // ==========================================

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Optional (kept for compatibility)
    public User getUser(Long id) {
        return getUserById(id);
    }

    // ==========================================
    // Get User By Email
    // ==========================================

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // ==========================================
    // Update User
    // ==========================================

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // ==========================================
    // Delete User
    // ==========================================

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ==========================================
    // Change Password
    // ==========================================

    public String changePassword(Authentication authentication,
                                 ChangePasswordRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        return "Password changed successfully";
    }

}