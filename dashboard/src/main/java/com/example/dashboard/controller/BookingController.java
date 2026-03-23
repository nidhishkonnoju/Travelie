package com.example.dashboard.controller;

import com.example.dashboard.dto.BookingRequestDTO;
import com.example.dashboard.dto.BookingResponseDTO;
import com.example.dashboard.model.BookingStatus;
import com.example.dashboard.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.dashboard.repository.UserRepository;
import com.example.dashboard.model.User;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('TRAVELER', 'ADMIN')")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody BookingRequestDTO request,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(bookingService.createBooking(user.getId(), request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
    public ResponseEntity<Page<BookingResponseDTO>> getAllBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAVELER')")
    public ResponseEntity<Page<BookingResponseDTO>> getUserBookings(
            @PathVariable Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIDE', 'TRAVELER')")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAVELER')")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}
