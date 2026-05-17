package com.example.second_wind.repository;

import com.example.second_wind.model.ApplicationTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationTimelineRepository extends JpaRepository<ApplicationTimeline,Long> {
    List<ApplicationTimeline> findByJobApplicationIdOrderByChangedAtAsc(Long jobApplicationId);
}
