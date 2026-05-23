package com.example.second_wind.controller; // Ensure this matches your package layout

import com.example.second_wind.model.CopilotScan;
import com.example.second_wind.model.dto.AnalysisRequest;
import com.example.second_wind.model.dto.AnalysisResponse;
import com.example.second_wind.model.dto.SaveScanRequest;
import com.example.second_wind.service.CopilotService;
import com.example.second_wind.service.CopilotScanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/copilot")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CopilotController {

    private final CopilotService copilotService;
    private final CopilotScanService copilotScanService;

    public CopilotController(CopilotService copilotService, CopilotScanService copilotScanService) {
        this.copilotService = copilotService;
        this.copilotScanService = copilotScanService;
    }

    @PostMapping("/analyze")
    public AnalysisResponse analyzeJob(@RequestBody AnalysisRequest request) {
        System.out.println("DEBUG - Received Job Desc Length: " +
                (request.getJobDescription() != null ? request.getJobDescription().length() : "NULL"));
        System.out.println("DEBUG - Received Resume Text Length: " +
                (request.getResumeText() != null ? request.getResumeText().length() : "NULL"));

        return copilotService.analyzeJobDescription(
                request.getJobDescription(),
                request.getResumeText()
        );
    }

    @PostMapping("/scans")
    public ResponseEntity<CopilotScan> saveScan(
            @RequestBody SaveScanRequest request,
            Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CopilotScan saved = copilotScanService.saveStandaloneScan(request, auth.getName());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/history")
    public ResponseEntity<List<CopilotScan>> getUserCopilotHistory(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CopilotScan> scansHistory = copilotScanService.getHistoryForUser(auth.getName());
        return ResponseEntity.ok(scansHistory);
    }
}