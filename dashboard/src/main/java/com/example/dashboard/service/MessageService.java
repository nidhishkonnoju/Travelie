package com.example.dashboard.service;

import com.example.dashboard.dto.MessageRequestDTO;
import com.example.dashboard.dto.MessageResponseDTO;
import com.example.dashboard.model.Message;
import com.example.dashboard.model.User;
import com.example.dashboard.repository.MessageRepository;
import com.example.dashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageResponseDTO sendMessage(Long senderId, MessageRequestDTO request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        return mapToResponseDTO(savedMessage);
    }

    public Page<MessageResponseDTO> getInbox(Long userId, Pageable pageable) {
        return messageRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToResponseDTO);
    }

    public List<MessageResponseDTO> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public MessageResponseDTO markAsRead(Long messageId, Long receiverId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getReceiver().getId().equals(receiverId)) {
            throw new RuntimeException("Not authorized to mark this message as read");
        }

        message.setRead(true);
        Message updatedMessage = messageRepository.save(message);
        return mapToResponseDTO(updatedMessage);
    }

    private MessageResponseDTO mapToResponseDTO(Message message) {
        return MessageResponseDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getName())
                .content(message.getContent())
                .isRead(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
