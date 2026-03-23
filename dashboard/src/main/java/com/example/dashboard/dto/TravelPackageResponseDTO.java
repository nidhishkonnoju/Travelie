package com.example.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelPackageResponseDTO {
    private Long id;
    private String title;
    private String location;
    private String description;
    private BigDecimal price;
    private Integer durationDays;
    private Integer durationNights;
    private Double rating;
    private Boolean available;
    private Integer availableSlots;
    private Long guideId;
    private String guideName;
    private LocalDateTime createdAt;
    private List<ItineraryDayDTO> itineraries;

    public Long getGuideId() {
        return this.guideId;
    }

    public void setGuideId(Long guideId) {
        this.guideId = guideId;
    }

    public String getGuideName() {
        return this.guideName;
    }

    public void setGuideName(String guideName) {
        this.guideName = guideName;
    }
}
