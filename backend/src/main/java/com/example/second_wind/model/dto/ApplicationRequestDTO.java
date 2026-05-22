package com.example.second_wind.model.dto;

import com.example.second_wind.model.JobApplication;
import lombok.Data;

@Data
public class ApplicationRequestDTO {
    private JobApplication jobApplication;
    private String companyName;
    private String companyDomain;
}