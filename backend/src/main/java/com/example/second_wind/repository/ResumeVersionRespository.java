package com.example.second_wind.repository;

import com.example.second_wind.model.ResumeVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeVersionRespository extends JpaRepository<ResumeVersion,Long> {
    List<ResumeVersion> findByJobApplicationId(Long id);

    List<ResumeVersion> findByJobApplicationUserEmail(String email);
}
