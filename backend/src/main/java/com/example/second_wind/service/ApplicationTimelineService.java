package com.example.second_wind.service;

import com.example.second_wind.model.ApplicationTimeline;
import com.example.second_wind.repository.ApplicationTimelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicationTimelineService {

    @Autowired
    private ApplicationTimelineRepository timelineRepository;

    public ApplicationTimelineService (ApplicationTimelineRepository applicationTimelineRepository) {
        this.timelineRepository = applicationTimelineRepository;
    }

    public List<ApplicationTimeline> getTimelineByJobApplicationId(Long jobApplicationId) {
        return timelineRepository.findByJobApplicationIdOrderByChangedAtAsc(jobApplicationId);
    }

    public ApplicationTimeline addManualTimelineEvent(ApplicationTimeline event) {
        return timelineRepository.save(event);
    }
}