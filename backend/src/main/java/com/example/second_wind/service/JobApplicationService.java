package com.example.second_wind.service;

import com.example.second_wind.model.ApplicationStatus;
import com.example.second_wind.model.ApplicationTimeline;
import com.example.second_wind.model.Company;
import com.example.second_wind.model.JobApplication;
import com.example.second_wind.model.User;
import com.example.second_wind.repository.ApplicationTimelineRepository;
import com.example.second_wind.repository.JobApplicationRepository;
import com.example.second_wind.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final CompanyService companyService;
    private final ApplicationTimelineRepository applicationTimelineRepository;
    private final UserRepository userRepository; // Added to lookup user contexts

    public JobApplicationService(
            JobApplicationRepository jobApplicationRepository,
            CompanyService companyService,
            ApplicationTimelineRepository applicationTimelineRepository,
            UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.companyService = companyService;
        this.applicationTimelineRepository = applicationTimelineRepository;
        this.userRepository = userRepository;
    }

    // 1. Filtered list by user email
    public List<JobApplication> getAllApplications(String email) {
        return jobApplicationRepository.findByUserEmail(email);
    }

    // 2. Filtered single find by ID and user email (using Integer to match entity)
    public JobApplication getJobApplicationById(Integer id, String email) {
        return jobApplicationRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Job Application Not Found or Access Denied"));
    }

    // 3. Delete protected by user email context
    public void deleteJobApplicationById(Integer id, String email) {
        // Ensure it belongs to them before executing the deletion
        JobApplication app = getJobApplicationById(id, email);
        jobApplicationRepository.delete(app);
    }

    @Transactional
    public JobApplication createApplication(JobApplication application, String companyName, String companyDomain, String email) {
        // Find the authenticated user to link the application
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User context not found"));

        Company company = companyService.getOrCreateCompany(companyName, companyDomain);

        application.setCompany(company);
        application.setUser(user); // Tie the application to this specific user profile

        JobApplication savedApp = jobApplicationRepository.save(application);

        ApplicationTimeline initialTimeline = new ApplicationTimeline();
        initialTimeline.setJobApplication(savedApp);
        initialTimeline.setStageName("Applied");
        applicationTimelineRepository.save(initialTimeline);

        return savedApp;
    }

    @Transactional
    public JobApplication updateApplicationStatus(Integer id, String statusStr, String currentStage, String email) {
        // Pulls only if it matches ID and email
        JobApplication app = getJobApplicationById(id, email);

        ApplicationStatus newStatus = ApplicationStatus.valueOf(statusStr.toUpperCase());
        app.setStatus(newStatus);

        if (currentStage != null) {
            app.setCurrentStage(currentStage);
        }
        app.setUpdatedAt(ZonedDateTime.now());

        JobApplication updatedApp = jobApplicationRepository.save(app);

        ApplicationTimeline changeLog = new ApplicationTimeline();
        changeLog.setJobApplication(updatedApp);
        changeLog.setStageName("Status moved to: " + statusStr + " (" + currentStage + ")");
        applicationTimelineRepository.save(changeLog);

        return updatedApp;
    }
}