package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.dto.LoginRequest;
import com.jay.academic_event_management.dto.LoginResponse;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.repository.UserRepository;
import com.jay.academic_event_management.security.JwtUtil;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (BadCredentialsException e) {

            throw new RuntimeException("Invalid Email or Password");

        }

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(request.getEmail());

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "STUDENT";

        return new LoginResponse(
                token,
                "Login Successful",
                user.getId(),
                roleName
        );
    }

}