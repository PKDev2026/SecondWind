package com.example.second_wind.controller;

import com.example.second_wind.model.ResumeVersion;
import com.example.second_wind.service.ResumeVersionService;
import org.springframework.http.ResponseEntity;
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
            @PathVariable Long jobId,
            @RequestParam String versionName,
            @RequestBody TailoredBodyDTO body) {

        ResumeVersion saved = resumeVersionService.saveTailoredVersion(
                jobId, versionName, body.getTailoredBullets(), body.getSkillsAligned()
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