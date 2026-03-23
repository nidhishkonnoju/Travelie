package com.example.dashboard.service;

import com.example.dashboard.dto.TravelPackageRequestDTO;
import com.example.dashboard.dto.TravelPackageResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TravelPackageService {
    TravelPackageResponseDTO createPackage(TravelPackageRequestDTO request);

    Page<TravelPackageResponseDTO> getAllPackages(String location, Pageable pageable);

    TravelPackageResponseDTO getPackageById(Long id);

    TravelPackageResponseDTO updatePackage(Long id, TravelPackageRequestDTO request);

    void deletePackage(Long id);
}
