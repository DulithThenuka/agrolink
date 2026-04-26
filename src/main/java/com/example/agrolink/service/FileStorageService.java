package com.example.agrolink.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${upload.path}")
    private String uploadPath;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp"
    );

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB

    public String saveFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // ✅ Size validation
        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        // ✅ MIME type validation
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPG, PNG, WEBP images are allowed");
        }

        try {
            Path uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            // ✅ Clean filename
            String originalName = file.getOriginalFilename();
            if (originalName == null) {
                throw new IllegalArgumentException("Invalid file name");
            }

            String cleanName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

            // ✅ Extension validation
            String extension = cleanName.substring(cleanName.lastIndexOf(".") + 1).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new IllegalArgumentException("Invalid file extension");
            }

            String fileName = UUID.randomUUID() + "_" + cleanName;

            Path targetPath = uploadDir.resolve(fileName);

            // ✅ Save file safely
            Files.copy(file.getInputStream(), targetPath);

            logger.info("File uploaded successfully: {}", fileName);

            return "/uploads/" + fileName;

        } catch (IOException e) {
            logger.error("File upload failed", e);
            throw new IllegalStateException("File upload failed", e);
        }
    }
}