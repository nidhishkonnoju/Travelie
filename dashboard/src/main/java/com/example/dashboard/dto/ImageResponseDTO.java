package com.example.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponseDTO {
    private Long id;
    private String url;
    private String altText;
    private boolean isPrimary;
    private Long travelPackageId;
    private LocalDateTime createdAt;
}
