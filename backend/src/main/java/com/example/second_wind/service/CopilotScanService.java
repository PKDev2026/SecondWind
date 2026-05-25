package com.example.second_wind.service;

import com.example.second_wind.model.CopilotScan;
import com.example.second_wind.model.User; // Ensure this matches your User model path
import com.example.second_wind.model.dto.SaveScanRequest;
import com.example.second_wind.repository.CopilotScanRepository;
import com.example.second_wind.repository.UserRepository; // Assuming you have a UserRepository
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CopilotScanService {

    private final CopilotScanRepository copilotScanRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public CopilotScan saveStandaloneScan(SaveScanRequest request, String email) {
        // Find user by email context to securely fetch their database ID
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        CopilotScan scan = new CopilotScan();
        scan.setUserId(user.getId());
        scan.setJobTitle(request.getJobTitle() == null || request.getJobTitle().isBlank()
                ? "Untargeted Scan" : request.getJobTitle());
        scan.setCompanyName(request.getCompanyName());
        scan.setRawJobDescription(request.getRawJobDescription());
        scan.setMatchScore(request.getAnalysisData().matchScore());

        try {
            // Serialize lists down into native JSON strings for the DB schema
            scan.setKeywordsMatched(objectMapper.writeValueAsString(request.getAnalysisData().keywordsMatched()));
            scan.setKeywordsMissing(objectMapper.writeValueAsString(request.getAnalysisData().keywordsMissing()));
            scan.setRecommendations(objectMapper.writeValueAsString(request.getAnalysisData().recommendations()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize AI analysis arrays for storage", e);
        }

        return copilotScanRepository.save(scan);
    }

    public Page<CopilotScan> getHistoryForUserPaginated(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // Spring Data JpaRepository automatically handles passing Pageable to generate SQL LIMIT/OFFSET clauses
        return copilotScanRepository.findByUserId(user.getId(), pageable);
    }
}