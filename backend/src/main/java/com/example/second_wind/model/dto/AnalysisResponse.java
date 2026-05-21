package com.example.second_wind.model.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import java.util.List;

public record AnalysisResponse(
    int matchScore,
    List<String> keywordsMatched,
    List<String> keywordsMissing,
    @JsonAlias({"actionableRecommendations", "recommendations"})
    List<String> recommendations
) {}
