package com.example.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryDayDTO {
    private Long id;
    private Integer dayNumber;
    private String title;
    private String description;
}
