package com.example.dashboard.dto;

import com.example.dashboard.model.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDTO {
    private Long id;
    private Long userId;
    private Long travelPackageId;
    private LocalDateTime bookingDate;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private Integer participants;
}
