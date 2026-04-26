package com.example.agrolink.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        if (!StringUtils.hasText(uploadDir)) {
            throw new IllegalStateException("Upload directory is not configured");
        }

        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(uploadPath);
        } catch (Exception e) {
            throw new IllegalStateException("Could not create upload directory: " + uploadPath, e);
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath.toUri().toString() + "/") // ✅ FIXED
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS)); // ✅ modern caching
    }
}