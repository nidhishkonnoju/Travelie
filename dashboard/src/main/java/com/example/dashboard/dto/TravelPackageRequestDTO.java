package com.example.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelPackageRequestDTO {
    private String title;
    private String location;
    private String description;
    private BigDecimal price;
    private Integer durationDays;
    private Integer durationNights;
    private Double rating;
    private Boolean available;
    private Long guideId;
    private List<ItineraryDayDTO> itineraries;

    public Long getGuideId() {
        return this.guideId;
    }

    public void setGuideId(Long guideId) {
        this.guideId = guideId;
    }
}
