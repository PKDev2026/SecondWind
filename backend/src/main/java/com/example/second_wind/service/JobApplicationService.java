package com.example.second_wind.service;

import com.example.second_wind.model.ApplicationStatus;
import com.example.second_wind.model.ApplicationTimeline;
import com.example.second_wind.model.Company;
import com.example.second_wind.model.JobApplication;
import com.example.second_wind.repository.ApplicationTimelineRepository;
import com.example.second_wind.repository.JobApplicationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class JobApplicationService {


    private final JobApplicationRepository jobApplicationRepository;
    private final CompanyService companyService;
    private final ApplicationTimelineRepository applicationTimelineRepository;

    public JobApplicationService (JobApplicationRepository jobApplicationRepository, CompanyService companyService, ApplicationTimelineRepository applicationTimelineRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.companyService = companyService;
        this.applicationTimelineRepository = applicationTimelineRepository;
    }

    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    public JobApplication getJobApplicationById(Long id) {
        return jobApplicationRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Job Application Not Found"));
    }

    public void deleteAllJobApplications() {
        jobApplicationRepository.deleteAll();
    }

    public void deleteJobApplicationById(Long id) {
        jobApplicationRepository.deleteById(id);
    }

    @Transactional
    public JobApplication createApplication (JobApplication application, String companyName, String companyDomain) {

        Company company = companyService.getOrCreateCompany(companyName, companyDomain);
        application.setCompany(company);

        JobApplication savedApp = jobApplicationRepository.save(application);

        ApplicationTimeline initialTimeline = new ApplicationTimeline();
        initialTimeline.setJobApplication(savedApp);
        initialTimeline.setStageName("Applied");
        applicationTimelineRepository.save(initialTimeline);

        return savedApp;
    }

    @Transactional
    public JobApplication updateApplicationStatus(Long id, String statusStr, String currentStage) {
        JobApplication app = getJobApplicationById(id);

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
