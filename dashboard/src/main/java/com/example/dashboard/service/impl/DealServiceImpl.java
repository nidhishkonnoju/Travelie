package com.example.dashboard.service.impl;

import com.example.dashboard.dto.DealRequestDTO;
import com.example.dashboard.dto.DealResponseDTO;
import com.example.dashboard.model.Deal;
import com.example.dashboard.model.TravelPackage;
import com.example.dashboard.repository.DealRepository;
import com.example.dashboard.repository.TravelPackageRepository;
import com.example.dashboard.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {

    private final DealRepository dealRepository;
    private final TravelPackageRepository travelPackageRepository;

    @Override
    public DealResponseDTO createDeal(DealRequestDTO request) {
        TravelPackage travelPackage = travelPackageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Travel package not found"));

        Deal deal = Deal.builder()
                .title(request.getTitle())
                .discountPercentage(request.getDiscountPercentage())
                .validUntil(request.getValidUntil())
                .travelPackage(travelPackage)
                .build();

        Deal saved = dealRepository.save(deal);
        return mapToDto(saved);
    }

    @Override
    public Page<DealResponseDTO> getAllDeals(Pageable pageable) {
        return dealRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public DealResponseDTO getDealById(Long id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));
        return mapToDto(deal);
    }

    @Override
    public DealResponseDTO updateDeal(Long id, DealRequestDTO request) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        TravelPackage travelPackage = travelPackageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Travel package not found"));

        deal.setTitle(request.getTitle());
        deal.setDiscountPercentage(request.getDiscountPercentage());
        deal.setValidUntil(request.getValidUntil());
        deal.setTravelPackage(travelPackage);

        Deal updated = dealRepository.save(deal);
        return mapToDto(updated);
    }

    @Override
    public void deleteDeal(Long id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));
        deal.setDeletedAt(LocalDateTime.now());
        dealRepository.save(deal);
    }

    private DealResponseDTO mapToDto(Deal deal) {
        return DealResponseDTO.builder()
                .id(deal.getId())
                .title(deal.getTitle())
                .discountPercentage(deal.getDiscountPercentage())
                .validUntil(deal.getValidUntil())
                .packageId(deal.getTravelPackage().getId())
                .packageTitle(deal.getTravelPackage().getTitle())
                .build();
    }
}
