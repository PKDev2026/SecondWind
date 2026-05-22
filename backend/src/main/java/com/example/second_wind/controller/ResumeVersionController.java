package com.example.second_wind.controller;

import com.example.second_wind.model.ResumeVersion;
import com.example.second_wind.service.ResumeVersionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/application/{jobId}")
    public ResponseEntity<ResumeVersion> saveVersion(
            @PathVariable Integer jobId,
            @RequestParam String versionName,
            @RequestBody TailoredBodyDTO body,
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

    public static class TailoredBodyDTO {
        private String tailoredBullets;
        private String skillsAligned;

        public String getTailoredBullets() { return tailoredBullets; }
        public void setTailoredBullets(String tailoredBullets) { this.tailoredBullets = tailoredBullets; }
        public String getSkillsAligned() { return skillsAligned; }
        public void setSkillsAligned(String skillsAligned) { this.skillsAligned = skillsAligned; }
    }
}