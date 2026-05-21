package com.example.second_wind.model.dto;

import lombok.Data;

@Data
public class AnalysisRequest {
    private String jobDescription;
    private String resumeText;

    public AnalysisRequest() {
        this.jobDescription = "";
        this.resumeText = "";
    }
}