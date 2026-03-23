package com.example.dashboard.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DealRequestDTO {
    private String title;
    private Double discountPercentage;
    private LocalDateTime validUntil;
    private Long packageId;
}
