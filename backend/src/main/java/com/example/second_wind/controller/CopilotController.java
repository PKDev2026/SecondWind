package com.example.second_wind.controller;

import com.example.second_wind.model.dto.AnalysisRequest;
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
    public AnalysisResponse analyzeJob(@RequestBody AnalysisRequest request) {
        System.out.println("DEBUG - Received Job Desc Length: " +
                (request.getJobDescription() != null ? request.getJobDescription().length() : "NULL"));
        System.out.println("DEBUG - Received Resume Text Length: " +
                (request.getResumeText() != null ? request.getResumeText().length() : "NULL"));

        // Pass both parameters down to the updated service layer
        return copilotService.analyzeJobDescription(
                request.getJobDescription(),
                request.getResumeText()
        );
    }
}