package com.example.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private com.example.dashboard.model.Role role;
    private java.time.LocalDateTime createdAt;
}