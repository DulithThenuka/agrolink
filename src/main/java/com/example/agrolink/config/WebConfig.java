package com.example.agrolink.config;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.*;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);
    private static final String RESOURCE_HANDLER = "/uploads/**";

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {

        validateUploadDir();

        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(uploadPath);
            logger.info("Upload directory initialized at: {}", uploadPath);
        } catch (Exception ex) {
            logger.error("Failed to initialize upload directory: {}", uploadPath, ex);
            throw new IllegalStateException("Could not create upload directory", ex);
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler(RESOURCE_HANDLER)
                .addResourceLocations(buildResourceLocation())
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic());
    }

    // ================== HELPERS ==================

    private void validateUploadDir() {
        if (!StringUtils.hasText(uploadDir)) {
            throw new IllegalStateException("Upload directory is not configured");
        }
    }

    private String buildResourceLocation() {
        return uploadPath.toUri().toString();
    }
}