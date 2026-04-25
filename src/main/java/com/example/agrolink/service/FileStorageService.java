package com.example.agrolink.service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    @Value("${upload.path}")
    private String uploadPath;

    public String saveFile(MultipartFile file) {

        if (file.isEmpty()) {
            return null;
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed!");
        }

        try {
            File dir = new File(uploadPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            File destination = new File(uploadPath, fileName);
            file.transferTo(destination);

            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("File upload failed!", e);
        }
    }
}