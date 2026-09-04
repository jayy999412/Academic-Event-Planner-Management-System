package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.dto.ChangePasswordRequest;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.service.UserService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register User
    @PostMapping
    public User saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Get All Users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get User By ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    // Delete User
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // Logged-in User Profile
    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {

        String email = authentication.getName();

        return userService.getUserByEmail(email);
    }

    // Change Password
    @PostMapping("/change-password")
    public String changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        return userService.changePassword(authentication, request);
    }
}