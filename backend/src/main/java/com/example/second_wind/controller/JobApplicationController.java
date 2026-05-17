package com.example.second_wind.controller;

import com.example.second_wind.model.JobApplication;
import com.example.second_wind.service.JobApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000") // Allows Next.js to talk to this endpoint
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        return ResponseEntity.ok(jobApplicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(jobApplicationService.getJobApplicationById(id));
    }

    @PostMapping
    public ResponseEntity<JobApplication> createApplication(@RequestBody ApplicationRequestDTO request) {
        JobApplication created = jobApplicationService.createApplication(
                request.getJobApplication(),
                request.getCompanyName(),
                request.getCompanyDomain()
        );
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String currentStage) {
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(id, status, currentStage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        jobApplicationService.deleteJobApplicationById(id);
        return ResponseEntity.noContent().build();
    }

    // Simple Data Transfer Object layout to handle composite frontend payloads cleanly
    public static class ApplicationRequestDTO {
        private JobApplication jobApplication;
        private String companyName;
        private String companyDomain;

        public JobApplication getJobApplication() { return jobApplication; }
        public void setJobApplication(JobApplication jobApplication) { this.jobApplication = jobApplication; }
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public String getCompanyDomain() { return companyDomain; }
        public void setCompanyDomain(String companyDomain) { this.companyDomain = companyDomain; }
    }
}