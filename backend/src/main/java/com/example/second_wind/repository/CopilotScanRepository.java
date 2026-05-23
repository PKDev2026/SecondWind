package com.example.second_wind.repository;

import com.example.second_wind.model.CopilotScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CopilotScanRepository extends JpaRepository<CopilotScan, Long> {

    // Custom query to fetch all scans for a specific user, ordered latest to oldest
    List<CopilotScan> findByUserIdOrderByCreatedAtDesc(Long userId);
}