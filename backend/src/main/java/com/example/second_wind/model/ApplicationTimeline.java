package com.example.second_wind.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;

@Entity
@Table(name = "application_timeline")
@Data
public class ApplicationTimeline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;

    @Column(name = "stage_name", nullable = false)
    private String stageName;

    @Column(name = "changed_at", insertable = false, updatable = false)
    private ZonedDateTime changedAt;
}