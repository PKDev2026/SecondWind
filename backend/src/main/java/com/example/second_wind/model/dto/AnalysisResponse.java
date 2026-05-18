package com.example.second_wind.model.dto;

import java.util.List;

public record AnalysisResponse(
    int matchScore,
    List<String> keywordsMatched,
    List<String> keywordsMissing,
    List<String> recommendations
) {}
