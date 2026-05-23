package com.example.second_wind.controller;

import com.example.second_wind.model.Company;
import com.example.second_wind.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PostMapping("/resolve")
    public ResponseEntity<Company> getOrCreateCompany(
            @RequestParam String name,
            @RequestParam(required = false) String domain) {
        return ResponseEntity.ok(companyService.getOrCreateCompany(name, domain));
    }
}