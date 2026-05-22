package com.example.second_wind.model.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}