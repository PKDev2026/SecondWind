package com.example.second_wind.service;

import com.example.second_wind.model.Company;
import com.example.second_wind.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository repository) {
        this.companyRepository = repository;
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Transactional
    public Company getOrCreateCompany(String name, String domain) {
        return companyRepository.findByName(name).orElseGet(() -> {
            Company newCompany = new Company();
            newCompany.setName(name);
            newCompany.setDomain(domain);
            return companyRepository.save(newCompany);
        });
    }
}
