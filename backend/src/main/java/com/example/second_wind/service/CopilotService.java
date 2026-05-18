package com.example.second_wind.service;

import com.example.second_wind.model.dto.AnalysisResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CopilotService {

    private final ChatClient chatClient;

    // Spring AI automatically configures a ChatClient.Builder based on your properties
    public CopilotService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public AnalysisResponse analyzeJobDescription(String jobDescription) {
        // 1. Create a structural converter bound directly to your DTO record
        BeanOutputConverter<AnalysisResponse> converter = new BeanOutputConverter<>(AnalysisResponse.class);

        // 2. Draft the strategic instructions for the model
        String promptText = """
            You are an expert technical interview coach and senior software architect.
            Analyze the following target job description against the candidate's core profile.
            
            Candidate Core Profile:
            - Core Languages & Tech: Java 25, Spring Boot, PostgreSQL, React, TypeScript, Angular
            - Professional Level: Mid-Level Software Engineer (approx. 6 years experience)
            - Strengths: Backend systems architecture, API design, full-stack application development, data tier normalization.
            
            Target Job Description:
            {jobDescription}
            
            Instructions:
            - Calculate an honest, realistic matchScore (0-100%) based on structural stack alignment.
            - Extract keywordsMatched: Technical skills explicitly listed in the description that match the candidate profile.
            - Extract keywordsMissing: Crucial tools, architectures, cloud vendors, or frameworks requested in the job description that are NOT in the candidate profile.
            - Provide actionable recommendations: Strategic advice or technical focus areas to prepare before an interview for this role.
            
            {formatInstructions}
            """;

        // 3. Blend the prompt template with your dynamic inputs
        PromptTemplate template = new PromptTemplate(promptText);
        Prompt prompt = template.create(Map.of(
                "jobDescription", jobDescription,
                "formatInstructions", converter.getFormat() // Injects the exact JSON schema rules
        ));

        // 4. Fire the request over the wire and map the clean JSON result right back into your Java Object
        String rawResponse = chatClient.prompt(prompt)
                .call()
                .content();

        assert rawResponse != null;
        return converter.convert(rawResponse);
    }
}