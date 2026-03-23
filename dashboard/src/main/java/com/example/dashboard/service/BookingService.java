package com.example.dashboard.service;

import com.example.dashboard.dto.BookingRequestDTO;
import com.example.dashboard.dto.BookingResponseDTO;
import com.example.dashboard.model.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponseDTO createBooking(Long userId, BookingRequestDTO request);

    Page<BookingResponseDTO> getAllBookings(Pageable pageable);

    Page<BookingResponseDTO> getUserBookings(Long userId, Pageable pageable);

    BookingResponseDTO getBookingById(Long id);

    BookingResponseDTO updateBookingStatus(Long id, BookingStatus status);

    void deleteBooking(Long id);
}
