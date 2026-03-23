package com.example.dashboard.service;

import com.example.dashboard.dto.DealRequestDTO;
import com.example.dashboard.dto.DealResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DealService {
    DealResponseDTO createDeal(DealRequestDTO request);

    Page<DealResponseDTO> getAllDeals(Pageable pageable);

    DealResponseDTO getDealById(Long id);

    DealResponseDTO updateDeal(Long id, DealRequestDTO request);

    void deleteDeal(Long id);
}
