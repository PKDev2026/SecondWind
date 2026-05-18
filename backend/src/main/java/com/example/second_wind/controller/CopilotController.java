package com.example.second_wind.controller;

import com.example.second_wind.model.dto.AnalysisResponse;
import com.example.second_wind.service.CopilotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/copilot")
@CrossOrigin(origins = "http://localhost:3000") // Allows your Next.js frontend to talk to your backend safely
public class CopilotController {

    private final CopilotService copilotService;

    public CopilotController(CopilotService copilotService) {
        this.copilotService = copilotService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyzeJob(@RequestBody Map<String, String> request) {
        String jobDescription = request.get("jobDescription");

        if (jobDescription == null || jobDescription.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        AnalysisResponse response = copilotService.analyzeJobDescription(jobDescription);
        return ResponseEntity.ok(response);
    }
}