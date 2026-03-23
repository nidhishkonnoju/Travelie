package com.example.dashboard.service;

import com.example.dashboard.dto.ImageResponseDTO;
import com.example.dashboard.model.Image;
import com.example.dashboard.model.TravelPackage;
import com.example.dashboard.repository.ImageRepository;
import com.example.dashboard.repository.TravelPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final TravelPackageRepository travelPackageRepository;

    private final String UPLOAD_DIR = "uploads/images/";

    public ImageResponseDTO uploadImage(Long packageId, MultipartFile file, String altText, boolean isPrimary) {
        TravelPackage travelPackage = travelPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        try {
            // Create directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate a unique file name
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
            }
            String fileName = UUID.randomUUID().toString() + extension;

            // Save the file locally
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Create Image Entity
            Image image = Image.builder()
                    .url("/images/" + fileName)
                    .altText(altText)
                    .isPrimary(isPrimary)
                    .travelPackage(travelPackage)
                    .build();

            // if this is primary, maybe unseat others? Let's just save for now
            Image savedImage = imageRepository.save(image);

            return mapToResponseDTO(savedImage);

        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public List<ImageResponseDTO> getImagesForPackage(Long packageId) {
        return imageRepository.findByTravelPackageId(packageId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public void deleteImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        // we should probably delete the file from the filesystem too
        try {
            String fileName = image.getUrl().replace("/images/", "");
            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // log error but continue to delete entity
            e.printStackTrace();
        }
        imageRepository.delete(image);
    }

    private ImageResponseDTO mapToResponseDTO(Image image) {
        return ImageResponseDTO.builder()
                .id(image.getId())
                .url(image.getUrl())
                .altText(image.getAltText())
                .isPrimary(image.isPrimary())
                .travelPackageId(image.getTravelPackage().getId())
                .createdAt(image.getCreatedAt())
                .build();
    }
}
