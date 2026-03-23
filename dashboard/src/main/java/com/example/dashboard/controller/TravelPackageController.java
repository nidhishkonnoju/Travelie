package com.example.dashboard.controller;

import com.example.dashboard.dto.TravelPackageRequestDTO;
import com.example.dashboard.dto.TravelPackageResponseDTO;
import com.example.dashboard.service.TravelPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class TravelPackageController {

    private final TravelPackageService travelPackageService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TravelPackageResponseDTO> createPackage(@RequestBody TravelPackageRequestDTO request) {
        return ResponseEntity.ok(travelPackageService.createPackage(request));
    }

    @GetMapping
    public ResponseEntity<Page<TravelPackageResponseDTO>> getAllPackages(
            @RequestParam(required = false) String location,
            Pageable pageable) {
        return ResponseEntity.ok(travelPackageService.getAllPackages(location, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelPackageResponseDTO> getPackageById(@PathVariable Long id) {
        return ResponseEntity.ok(travelPackageService.getPackageById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TravelPackageResponseDTO> updatePackage(
            @PathVariable Long id,
            @RequestBody TravelPackageRequestDTO request) {
        return ResponseEntity.ok(travelPackageService.updatePackage(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePackage(@PathVariable Long id) {
        travelPackageService.deletePackage(id);
        return ResponseEntity.ok("Package deactivated successfully");
    }
}
