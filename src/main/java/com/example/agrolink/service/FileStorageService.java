package com.example.agrolink.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp"
    );

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB

    private final Path uploadDir;

    public FileStorageService(@Value("${upload.path}") String uploadPath) {
        this.uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
        initUploadDirectory();
    }

    // ================== PUBLIC ==================

    public String saveFile(MultipartFile file) {

        validateFile(file);

        String cleanFileName = sanitizeFileName(file.getOriginalFilename());
        String extension = extractExtension(cleanFileName);

        validateExtension(extension);

        String storedFileName = generateFileName(cleanFileName);

        Path targetPath = uploadDir.resolve(storedFileName);

        try (InputStream inputStream = file.getInputStream()) {

            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);

            logger.info("File uploaded successfully: {}", storedFileName);

            return buildFileUrl(storedFileName);

        } catch (IOException ex) {
            logger.error("File upload failed: {}", storedFileName, ex);
            throw new IllegalStateException("File upload failed", ex);
        }
    }

    // ================== INITIALIZATION ==================

    private void initUploadDirectory() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not create upload directory", ex);
        }
    }

    // ================== VALIDATION ==================

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPG, PNG, WEBP images are allowed");
        }
    }

    private void validateExtension(String extension) {
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Invalid file extension");
        }
    }

    // ================== HELPERS ==================

    private String sanitizeFileName(String originalName) {
        String safeName = Objects.requireNonNullElse(originalName, "file");
        return safeName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
    }

    private String extractExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf(".");
        if (dotIndex == -1) {
            throw new IllegalArgumentException("File must have an extension");
        }
        return fileName.substring(dotIndex + 1).toLowerCase();
    }

    private String generateFileName(String cleanName) {
        return UUID.randomUUID() + "_" + cleanName;
    }

    private String buildFileUrl(String fileName) {
        return "/uploads/" + fileName;
    }
}