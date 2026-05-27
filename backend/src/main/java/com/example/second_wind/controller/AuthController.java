package com.example.second_wind.controller;

import com.example.second_wind.model.User;
import com.example.second_wind.model.dto.AuthRequest;
import com.example.second_wind.model.dto.AuthResponse;
import com.example.second_wind.model.dto.PasswordUpdateRequest;
import com.example.second_wind.repository.UserRepository;
import com.example.second_wind.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());

        userRepository.save(user);
        return ResponseEntity.ok("Registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req, HttpServletResponse response) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        String token = jwtUtil.generateToken(req.getEmail());

        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);

        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        return ResponseEntity.ok(new AuthResponse(user.getEmail(), user.getFirstName()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok("Logged out.");
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest req, Authentication auth) {
        // 1. Ensure the session or JWT context is active
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized session context."));
        }

        // 2. Fetch the user context from the DB
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User account not found."));

        // 3. Match current raw password entry against the stored database hash
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(Map.of("message", "The current password you entered is incorrect."));
        }

        // 4. Encode the new credential and update the model
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));

        // 5. Commit change to PostgreSQL (the @PreUpdate hook will automatically refresh the updatedAt timestamp)
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(new AuthResponse(user.getEmail(), user.getFirstName()));
    }
}