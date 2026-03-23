package com.example.dashboard.repository;

import com.example.dashboard.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByTravelPackageId(Long packageId);
}
