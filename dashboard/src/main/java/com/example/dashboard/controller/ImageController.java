package com.example.dashboard.controller;

import com.example.dashboard.dto.ImageResponseDTO;
import com.example.dashboard.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImageResponseDTO> uploadImage(
            @RequestParam("packageId") Long packageId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", defaultValue = "") String altText,
            @RequestParam(value = "isPrimary", defaultValue = "false") boolean isPrimary) {

        return ResponseEntity.ok(imageService.uploadImage(packageId, file, altText, isPrimary));
    }

    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<ImageResponseDTO>> getImagesForPackage(@PathVariable Long packageId) {
        return ResponseEntity.ok(imageService.getImagesForPackage(packageId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteImage(@PathVariable Long id) {
        imageService.deleteImage(id);
        return ResponseEntity.ok("Image deleted successfully");
    }
}
