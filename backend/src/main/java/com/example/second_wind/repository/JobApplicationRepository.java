package com.example.second_wind.repository;

import com.example.second_wind.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    // Fetch only the applications belonging to the logged-in user's email
    List<JobApplication> findByUserEmail(String email);

    // Fetch a single application by ID only if it belongs to this specific user
    Optional<JobApplication> findByIdAndUserEmail(Integer id, String email);
}