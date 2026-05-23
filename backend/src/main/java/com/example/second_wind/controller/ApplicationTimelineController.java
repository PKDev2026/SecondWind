package com.example.second_wind.controller;

import com.example.second_wind.model.ApplicationTimeline;
import com.example.second_wind.service.ApplicationTimelineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timeline")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ApplicationTimelineController {

    private final ApplicationTimelineService timelineService;

    public ApplicationTimelineController(ApplicationTimelineService timelineService) {
        this.timelineService = timelineService;
    }

    @GetMapping("/application/{jobId}")
    public ResponseEntity<List<ApplicationTimeline>> getTimelineByJobId(@PathVariable Long jobId) {
        return ResponseEntity.ok(timelineService.getTimelineByJobApplicationId(jobId));
    }
}