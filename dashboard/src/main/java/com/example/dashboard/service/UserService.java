package com.example.dashboard.service;

import com.example.dashboard.dto.UserRequestDTO;
import com.example.dashboard.dto.UserResponseDTO;
import com.example.dashboard.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO request);

    Page<UserResponseDTO> getAllUsers(Role role, Pageable pageable);

    UserResponseDTO getUserById(Long id);

    UserResponseDTO updateUser(Long id, UserRequestDTO request);

    void deleteUser(Long id);

    void activateUser(Long id);

    List<UserResponseDTO> getContacts(String email);
}