package com.example.dashboard.service.impl;

import com.example.dashboard.dto.UserRequestDTO;
import com.example.dashboard.dto.UserResponseDTO;
import com.example.dashboard.model.Role;
import com.example.dashboard.model.User;
import com.example.dashboard.repository.UserRepository;
import com.example.dashboard.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public UserResponseDTO createUser(UserRequestDTO request) {
                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole() != null ? request.getRole() : Role.TRAVELER)
                                .build();

                User saved = userRepository.save(user);
                return mapToDto(saved);
        }

        @Override
        public Page<UserResponseDTO> getAllUsers(Role role, Pageable pageable) {
                Page<User> usersPage;
                if (role != null) {
                        usersPage = userRepository.findByRole(role, pageable);
                } else {
                        usersPage = userRepository.findAll(pageable);
                }
                return usersPage.map(this::mapToDto);
        }

        @Override
        public UserResponseDTO getUserById(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return mapToDto(user);
        }

        @Override
        public UserResponseDTO updateUser(Long id, UserRequestDTO request) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setName(request.getName());
                user.setEmail(request.getEmail());
                if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(request.getPassword()));
                }
                if (request.getRole() != null) {
                        user.setRole(request.getRole());
                }

                User updated = userRepository.save(user);
                return mapToDto(updated);
        }

        @Override
        public void deleteUser(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                user.setDeletedAt(LocalDateTime.now());
                userRepository.save(user);
        }

        @Override
        public void activateUser(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                user.setDeletedAt(null);
                userRepository.save(user);
        }

        @Override
        public List<UserResponseDTO> getContacts(String email) {
                User currentUser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<User> contacts = new ArrayList<>();
                if (currentUser.getRole() == Role.ADMIN) {
                        contacts.addAll(userRepository.findByRole(Role.GUIDE));
                } else if (currentUser.getRole() == Role.GUIDE) {
                        contacts.addAll(userRepository.findByRole(Role.ADMIN));
                        contacts.addAll(userRepository.findByRole(Role.TRAVELER));
                } else if (currentUser.getRole() == Role.TRAVELER) {
                        contacts.addAll(userRepository.findByRole(Role.GUIDE));
                }

                return contacts.stream().map(this::mapToDto).collect(Collectors.toList());
        }

        private UserResponseDTO mapToDto(User user) {
                return UserResponseDTO.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .createdAt(user.getCreatedAt())
                                .build();
        }
}