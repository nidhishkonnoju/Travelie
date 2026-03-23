package com.example.dashboard.controller;

import com.example.dashboard.dto.MessageRequestDTO;
import com.example.dashboard.dto.MessageResponseDTO;
import com.example.dashboard.model.User;
import com.example.dashboard.repository.UserRepository;
import com.example.dashboard.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @RequestBody MessageRequestDTO request,
            Authentication authentication) {
        Long senderId = getAuthenticatedUserId(authentication);
        return ResponseEntity.ok(messageService.sendMessage(senderId, request));
    }

    @GetMapping("/inbox")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<MessageResponseDTO>> getInbox(
            Pageable pageable,
            Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        return ResponseEntity.ok(messageService.getInbox(userId, pageable));
    }

    @GetMapping("/conversation/{otherUserId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponseDTO>> getConversation(
            @PathVariable Long otherUserId,
            Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        return ResponseEntity.ok(messageService.getConversation(userId, otherUserId));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponseDTO> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        Long receiverId = getAuthenticatedUserId(authentication);
        return ResponseEntity.ok(messageService.markAsRead(id, receiverId));
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return user.getId();
    }
}
