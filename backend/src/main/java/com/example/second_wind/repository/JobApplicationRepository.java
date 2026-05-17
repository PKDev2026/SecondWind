package com.example.second_wind.repository;

import com.example.second_wind.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication,Long> {
    List<JobApplication> findByStatus(String status);
}
