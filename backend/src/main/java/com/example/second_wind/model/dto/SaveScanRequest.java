package com.example.second_wind.model.dto;

import lombok.Data;

@Data
public class SaveScanRequest {
    private String jobTitle;
    private String companyName;
    private String rawJobDescription;
    private AnalysisResponse analysisData;
}