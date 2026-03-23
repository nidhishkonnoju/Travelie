package com.example.dashboard.controller;

import com.example.dashboard.dto.DealRequestDTO;
import com.example.dashboard.dto.DealResponseDTO;
import com.example.dashboard.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DealResponseDTO> createDeal(@RequestBody DealRequestDTO request) {
        return ResponseEntity.ok(dealService.createDeal(request));
    }

    @GetMapping
    public ResponseEntity<Page<DealResponseDTO>> getAllDeals(Pageable pageable) {
        return ResponseEntity.ok(dealService.getAllDeals(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DealResponseDTO> getDealById(@PathVariable Long id) {
        return ResponseEntity.ok(dealService.getDealById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DealResponseDTO> updateDeal(
            @PathVariable Long id,
            @RequestBody DealRequestDTO request) {
        return ResponseEntity.ok(dealService.updateDeal(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
        return ResponseEntity.ok("Deal deleted successfully");
    }
}
