package com.example.dashboard.repository;

import com.example.dashboard.model.TravelPackage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {
    Page<TravelPackage> findByLocationContainingIgnoreCase(String location, Pageable pageable);
}
