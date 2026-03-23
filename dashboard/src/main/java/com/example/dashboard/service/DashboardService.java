package com.example.dashboard.service;

import com.example.dashboard.dto.DashboardStatsDTO;
import com.example.dashboard.repository.BookingRepository;
import com.example.dashboard.repository.TravelPackageRepository;
import com.example.dashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final TravelPackageRepository travelPackageRepository;
    private final BookingRepository bookingRepository;

    public DashboardStatsDTO getStats() {
        long totalUsers = userRepository.count();
        long totalPackages = travelPackageRepository.count();
        long totalBookings = bookingRepository.count();
        Double totalRevenue = bookingRepository.sumTotalAmountForConfirmedBookings();

        return DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalPackages(totalPackages)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .build();
    }
}
