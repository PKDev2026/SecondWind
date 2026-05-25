package com.example.second_wind.controller;

import com.example.second_wind.model.CopilotScan;
import com.example.second_wind.model.User;
import com.example.second_wind.model.dto.AnalysisRequest;
import com.example.second_wind.model.dto.AnalysisResponse;
import com.example.second_wind.model.dto.SaveScanRequest;
import com.example.second_wind.repository.UserRepository;
import com.example.second_wind.service.CopilotService;
import com.example.second_wind.service.CopilotScanService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/copilot")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CopilotController {

    private final CopilotService copilotService;
    private final CopilotScanService copilotScanService;
    private final UserRepository userRepository;

    public CopilotController(CopilotService copilotService, CopilotScanService copilotScanService, UserRepository userRepository) {
        this.copilotService = copilotService;
        this.copilotScanService = copilotScanService;
        this.userRepository = userRepository;
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

    @PostMapping(value = "/resume/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfileResume(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User context not authenticated");
        }

        if (!"application/pdf".equals(file.getContentType())) {
            return ResponseEntity.badRequest().body("Only PDF files are supported");
        }

        try {
            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated user record not found"));

            // 1. Save the metadata and raw binary data exactly like before
            user.setResumePdfData(file.getBytes());
            user.setResumeFileName(file.getOriginalFilename());

            // 2. Extract plain text using Apache PDFBox
            String extractedText = "";
            try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                PDFTextStripper stripper = new PDFTextStripper();
                extractedText = stripper.getText(document);
            } catch (Exception pdfEx) {
                System.err.println("Error extracting text from PDF: " + pdfEx.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Could not parse text contents from this PDF file.");
            }

            // 3. Save the clean plain text to our new column
            user.setResumeExtractedText(extractedText);

            // 4. Commit everything to the database
            userRepository.save(user);

            return ResponseEntity.ok().body("{\"message\": \"Resume uploaded and text parsed successfully\"}");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process file upload: " + e.getMessage());
        }
    }

    @GetMapping("/resume/data")
    public ResponseEntity<?> getSavedResumeData(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // Create a simple map or custom DTO response returning the text and filename
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("fileName", user.getResumeFileName() != null ? user.getResumeFileName() : "");
        response.put("extractedText", user.getResumeExtractedText() != null ? user.getResumeExtractedText() : "");

        return ResponseEntity.ok(response);
    }
}