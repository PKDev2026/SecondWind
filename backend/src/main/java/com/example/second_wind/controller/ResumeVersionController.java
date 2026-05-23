package com.example.second_wind.controller;

import com.example.second_wind.model.ResumeVersion;
import com.example.second_wind.service.ResumeVersionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.second_wind.model.dto.TailoredBody;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeVersionController {

    private final ResumeVersionService resumeVersionService;

    public ResumeVersionController(ResumeVersionService resumeVersionService) {
        this.resumeVersionService = resumeVersionService;
    }

    @GetMapping("/application/{jobId}")
    public ResponseEntity<List<ResumeVersion>> getVersionsByJobId(@PathVariable Long jobId) {
        return ResponseEntity.ok(resumeVersionService.getVersionsByJobId(jobId));
    }

    @GetMapping("/user-history")
    public ResponseEntity<List<ResumeVersion>> getUserResumeHistory(Authentication auth) {
        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        // Calls a service method to look up versions through the user's job applications
        List<ResumeVersion> history = resumeVersionService.getAllVersionsForUser(auth.getName());
        return ResponseEntity.ok(history);
    }

    @PostMapping("/application/{jobId}")
    public ResponseEntity<ResumeVersion> saveVersion(
            @PathVariable Integer jobId,
            @RequestParam String versionName,
            @RequestBody TailoredBody body,
            Authentication auth) { // 1. Inject the Authentication context

        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 2. Use auth.getName() to supply the secure user email context
        ResumeVersion saved = resumeVersionService.saveTailoredVersion(
                jobId,
                versionName,
                body.getTailoredBullets(),
                body.getSkillsAligned(),
                auth.getName()
        );

        return ResponseEntity.ok(saved);
    }
}