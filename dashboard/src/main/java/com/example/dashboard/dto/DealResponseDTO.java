package com.example.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DealResponseDTO {
    private Long id;
    private String title;
    private Double discountPercentage;
    private LocalDateTime validUntil;
    private Long packageId;
    private String packageTitle;
}
