package com.example.second_wind.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;

@Entity
@Table(name = "resume_versions")
@Data
public class ResumeVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;

    @Column(name = "version_name", nullable = false)
    private String versionName;

    @Column(name = "tailored_bullets", columnDefinition = "TEXT")
    private String tailoredBullets;

    @Column(name = "skills_aligned", columnDefinition = "TEXT")
    private String skillsAligned;

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;
}