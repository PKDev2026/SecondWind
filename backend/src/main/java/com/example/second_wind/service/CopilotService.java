package com.example.second_wind.service;

import com.example.second_wind.model.dto.AnalysisResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.Map;
import java.util.List;

@Service
public class CopilotService {

    private final RestClient restClient;

    public CopilotService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public AnalysisResponse analyzeJobDescription(String jobDescription, String resumeText) {
        String apiKey = System.getenv("GEMINI_API_KEY");

        String promptText = "You are an expert technical career assistant and resume analyzer.\n\n" +
                "INSTRUCTIONS:\n" +
                "1. Compare the provided Resume against the Job Description.\n" +
                "2. Calculate a realistic matchScore (0 to 100) based on how well the skills and experience align.\n" +
                "3. Identify keywordsMatched (array of strings found in both).\n" +
                "4. Identify keywordsMissing (array of crucial technologies or qualifications requested in the job description but missing or weak on the resume).\n" +
                "5. Generate highly specific actionable recommendations (array of strings) to improve the resume for this exact role.\n" +
                "6. Return strictly valid JSON matching these keys. Do not include any conversational text outside the JSON block.\n\n" +
                "RESUME:\n" + resumeText + "\n\n" +
                "JOB DESCRIPTION:\n" + jobDescription;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", promptText)
                        ))
                )
        );

        try {
            // Pure native REST call - NO OpenAI headers or paths
            Map<String, Object> rawResponse = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/models/gemini-flash-latest:generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            System.out.println("Native Google Response: " + rawResponse);

            return mapToAnalysisResponse(rawResponse);

        } catch (Exception e) {
            System.err.println("Native Google HTTP call failed: " + e.getMessage());
            throw new RuntimeException("AI processing failed", e);
        }
    }

    private AnalysisResponse mapToAnalysisResponse(Map<String, Object> rawResponse) {
        try {
            // Navigate Google's nested response map structure safely
            List<?> candidates = (List<?>) rawResponse.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("No candidates returned from Gemini");
            }

            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);

            // Grab the raw JSON string wrapped in backticks
            String rawText = (String) firstPart.get("text");

            // Clean out the markdown wrapper format (```json ... ```) if present
            if (rawText.contains("```json")) {
                rawText = rawText.substring(rawText.indexOf("```json") + 7);
            }
            if (rawText.contains("```")) {
                rawText = rawText.substring(0, rawText.lastIndexOf("```"));
            }
            rawText = rawText.trim();

            // Use standard Jackson ObjectMapper to turn the clean string into your object fields
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(rawText, AnalysisResponse.class);

        } catch (Exception e) {
            System.err.println("Failed to parse Gemini JSON payload: " + e.getMessage());

            return new AnalysisResponse(
                    0,
                    new ArrayList<>(),
                    new ArrayList<>(),
                    List.of("Pipeline connected, but failed to extract the text block correctly. Check backend logs.")
            );
        }
    }
}