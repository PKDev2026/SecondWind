package com.example.second_wind.controller;

import com.example.second_wind.model.JobApplication;
import com.example.second_wind.model.dto.ApplicationRequestDTO;
import com.example.second_wind.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllApplications(Authentication auth) {
        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(jobApplicationService.getAllApplications(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getApplicationById(@PathVariable Integer id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(jobApplicationService.getJobApplicationById(id, auth.getName()));
    }

    @PostMapping
    public ResponseEntity<JobApplication> createApplication(
            @RequestBody ApplicationRequestDTO request,
            Authentication auth) {
        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        JobApplication created = jobApplicationService.createApplication(
                request.getJobApplication(),
                request.getCompanyName(),
                request.getCompanyDomain(),
                auth.getName()
        );
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status,
            @RequestParam(required = false) String currentStage,
            Authentication auth) {
        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(id, status, currentStage, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Integer id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        jobApplicationService.deleteJobApplicationById(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}