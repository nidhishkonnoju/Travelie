package com.example.dashboard.service.impl;

import com.example.dashboard.dto.BookingRequestDTO;
import com.example.dashboard.dto.BookingResponseDTO;
import com.example.dashboard.model.Booking;
import com.example.dashboard.model.BookingStatus;
import com.example.dashboard.model.TravelPackage;
import com.example.dashboard.model.User;
import com.example.dashboard.repository.BookingRepository;
import com.example.dashboard.repository.TravelPackageRepository;
import com.example.dashboard.repository.UserRepository;
import com.example.dashboard.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TravelPackageRepository travelPackageRepository;

    @Override
    public BookingResponseDTO createBooking(Long userId, BookingRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        TravelPackage travelPackage = travelPackageRepository.findById(request.getTravelPackageId())
                .orElseThrow(() -> new RuntimeException("Travel package not found"));

        BigDecimal totalAmount = travelPackage.getPrice().multiply(BigDecimal.valueOf(request.getParticipants()));

        Booking booking = Booking.builder()
                .user(user)
                .travelPackage(travelPackage)
                .bookingDate(LocalDateTime.now())
                .status(BookingStatus.PENDING)
                .totalAmount(totalAmount)
                .participants(request.getParticipants())
                .build();

        Booking saved = bookingRepository.save(booking);
        return mapToDto(saved);
    }

    @Override
    public Page<BookingResponseDTO> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public Page<BookingResponseDTO> getUserBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable).map(this::mapToDto);
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToDto(booking);
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Status transition logic can be added here
        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        return mapToDto(updated);
    }

    @Override
    public void deleteBooking(Long id) {
        // Soft delete implementation
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setDeletedAt(LocalDateTime.now());
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingResponseDTO mapToDto(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .travelPackageId(booking.getTravelPackage().getId())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .participants(booking.getParticipants())
                .build();
    }
}
