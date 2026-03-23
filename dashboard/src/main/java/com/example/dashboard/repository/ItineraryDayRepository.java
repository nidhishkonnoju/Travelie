package com.example.dashboard.repository;

import com.example.dashboard.model.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, Long> {
}
