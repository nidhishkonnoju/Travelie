package com.example.dashboard.service.impl;

import com.example.dashboard.dto.ItineraryDayDTO;
import com.example.dashboard.dto.TravelPackageRequestDTO;
import com.example.dashboard.dto.TravelPackageResponseDTO;
import com.example.dashboard.model.ItineraryDay;
import com.example.dashboard.model.TravelPackage;
import com.example.dashboard.model.User;
import com.example.dashboard.repository.TravelPackageRepository;
import com.example.dashboard.repository.UserRepository;
import com.example.dashboard.service.TravelPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TravelPackageServiceImpl implements TravelPackageService {

    private final TravelPackageRepository travelPackageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TravelPackageResponseDTO createPackage(TravelPackageRequestDTO request) {
        TravelPackage travelPackage = TravelPackage.builder()
                .title(request.getTitle())
                .location(request.getLocation())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationDays(request.getDurationDays())
                .durationNights(request.getDurationNights())
                .rating(request.getRating() != null ? request.getRating() : 0.0)
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .itineraries(new ArrayList<>())
                .build();

        if (request.getGuideId() != null) {
            User guide = userRepository.findById(request.getGuideId())
                    .orElseThrow(() -> new RuntimeException("Guide not found"));
            travelPackage.setGuide(guide);
        }

        if (request.getItineraries() != null) {
            for (ItineraryDayDTO itineraryDayDTO : request.getItineraries()) {
                ItineraryDay day = ItineraryDay.builder()
                        .dayNumber(itineraryDayDTO.getDayNumber())
                        .title(itineraryDayDTO.getTitle())
                        .description(itineraryDayDTO.getDescription())
                        .travelPackage(travelPackage)
                        .build();
                travelPackage.getItineraries().add(day);
            }
        }

        TravelPackage saved = travelPackageRepository.save(travelPackage);
        return mapToDto(saved);
    }

    @Override
    public Page<TravelPackageResponseDTO> getAllPackages(String location, Pageable pageable) {
        Page<TravelPackage> packagePage;
        if (location != null && !location.isEmpty()) {
            packagePage = travelPackageRepository.findByLocationContainingIgnoreCase(location, pageable);
        } else {
            packagePage = travelPackageRepository.findAll(pageable);
        }
        return packagePage.map(this::mapToDto);
    }

    @Override
    public TravelPackageResponseDTO getPackageById(Long id) {
        TravelPackage travelPackage = travelPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        return mapToDto(travelPackage);
    }

    @Override
    @Transactional
    public TravelPackageResponseDTO updatePackage(Long id, TravelPackageRequestDTO request) {
        TravelPackage travelPackage = travelPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        travelPackage.setTitle(request.getTitle());
        travelPackage.setLocation(request.getLocation());
        travelPackage.setDescription(request.getDescription());
        travelPackage.setPrice(request.getPrice());
        travelPackage.setDurationDays(request.getDurationDays());
        travelPackage.setDurationNights(request.getDurationNights());
        travelPackage.setRating(request.getRating());
        travelPackage.setAvailable(request.getAvailable());

        if (request.getGuideId() != null) {
            User guide = userRepository.findById(request.getGuideId())
                    .orElseThrow(() -> new RuntimeException("Guide not found"));
            travelPackage.setGuide(guide);
        } else {
            travelPackage.setGuide(null);
        }

        // Simple approach: clear old itineraries and add new ones
        travelPackage.getItineraries().clear();
        if (request.getItineraries() != null) {
            for (ItineraryDayDTO itineraryDayDTO : request.getItineraries()) {
                ItineraryDay day = ItineraryDay.builder()
                        .dayNumber(itineraryDayDTO.getDayNumber())
                        .title(itineraryDayDTO.getTitle())
                        .description(itineraryDayDTO.getDescription())
                        .travelPackage(travelPackage)
                        .build();
                travelPackage.getItineraries().add(day);
            }
        }

        TravelPackage updated = travelPackageRepository.save(travelPackage);
        return mapToDto(updated);
    }

    @Override
    public void deletePackage(Long id) {
        TravelPackage travelPackage = travelPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        travelPackage.setDeletedAt(LocalDateTime.now());
        travelPackageRepository.save(travelPackage);
    }

    private TravelPackageResponseDTO mapToDto(TravelPackage travelPackage) {
        List<ItineraryDayDTO> itineraryDTOs = new ArrayList<>();
        if (travelPackage.getItineraries() != null) {
            itineraryDTOs = travelPackage.getItineraries().stream().map(day -> ItineraryDayDTO.builder()
                    .id(day.getId())
                    .dayNumber(day.getDayNumber())
                    .title(day.getTitle())
                    .description(day.getDescription())
                    .build()).collect(Collectors.toList());
        }

        Long guideId = travelPackage.getGuide() != null ? travelPackage.getGuide().getId() : null;
        String guideName = travelPackage.getGuide() != null ? travelPackage.getGuide().getName() : null;

        return TravelPackageResponseDTO.builder()
                .id(travelPackage.getId())
                .title(travelPackage.getTitle())
                .location(travelPackage.getLocation())
                .description(travelPackage.getDescription())
                .price(travelPackage.getPrice())
                .durationDays(travelPackage.getDurationDays())
                .durationNights(travelPackage.getDurationNights())
                .rating(travelPackage.getRating())
                .available(travelPackage.getAvailable())
                .availableSlots(travelPackage.getAvailableSlots())
                .guideId(guideId)
                .guideName(guideName)
                .createdAt(travelPackage.getCreatedAt())
                .itineraries(itineraryDTOs)
                .build();
    }
}
