package com.example.second_wind.repository;

import com.example.second_wind.model.CopilotScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CopilotScanRepository extends JpaRepository<CopilotScan, Long> {

    // Changing this to accept Pageable allows clean, runtime-driven offset slices and sorting
    Page<CopilotScan> findByUserId(Long userId, Pageable pageable);
}