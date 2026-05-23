package com.example.second_wind.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(name = "copilot_scans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CopilotScan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "raw_job_description", nullable = false, columnDefinition = "TEXT")
    private String rawJobDescription;

    @Column(name = "match_score", nullable = false)
    private Integer matchScore;

    // Storing JSON blobs as strings in JPA to be safely converted by Jackson/Postgres
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "keywords_matched", nullable = false, columnDefinition = "jsonb")
    private String keywordsMatched;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "keywords_missing", nullable = false, columnDefinition = "jsonb")
    private String keywordsMissing;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "recommendations", nullable = false, columnDefinition = "jsonb")
    private String recommendations;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}