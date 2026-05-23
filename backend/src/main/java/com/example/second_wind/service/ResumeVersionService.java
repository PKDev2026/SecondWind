package com.example.second_wind.service;

import com.example.second_wind.model.JobApplication;
import com.example.second_wind.model.ResumeVersion;
import com.example.second_wind.repository.ResumeVersionRespository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResumeVersionService {
    
    private final ResumeVersionRespository resumeVersionRepository;
    private final JobApplicationService jobApplicationService;

    public ResumeVersionService (ResumeVersionRespository resumeVersionRepository, JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
        this.resumeVersionRepository = resumeVersionRepository;
    }

    public List<ResumeVersion> getVersionsByJobId(Long jobId) {
        return resumeVersionRepository.findByJobApplicationId(jobId);
    }

    @Transactional
    public ResumeVersion saveTailoredVersion(
            Integer jobId,
            String versionName,
            String bullets,        // Maps to your generated bullet updates
            String skillsAligned,  // We can merge keywordsMatched / keywordsMissing here
            String email) {

        // This line ensures the logged-in user actually owns this job application record
        JobApplication app = jobApplicationService.getJobApplicationById(jobId, email);

        ResumeVersion version = new ResumeVersion();
        version.setJobApplication(app);
        version.setVersionName(versionName);
        version.setTailoredBullets(bullets);
        version.setSkillsAligned(skillsAligned);

        return resumeVersionRepository.save(version);
    }
}