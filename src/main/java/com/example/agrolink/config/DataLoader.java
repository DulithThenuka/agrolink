package com.example.agrolink.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Component
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    public DataLoader(UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void run(String... args) {

        if (!StringUtils.hasText(adminEmail) || !StringUtils.hasText(adminPassword)) {
            logger.warn("Admin credentials not configured. Skipping admin creation.");
            return;
        }

        if (adminPassword.length() < 6) {
            throw new IllegalArgumentException("Admin password must be at least 6 characters");
        }

        String normalizedEmail = adminEmail.toLowerCase().trim();

        userRepository.findByEmail(normalizedEmail).ifPresentOrElse(
            user -> logger.info("Admin already exists"),
            () -> createAdminUser(normalizedEmail)
        );
    }

    private void createAdminUser(String email) {

        logger.info("Creating default admin user");

        User admin = new User();
        admin.setName("Admin");
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        admin.setLocation("System");

        admin.setEnabled(true);
        admin.setAccountNonLocked(true); // ✅ FIXED

        userRepository.save(admin);

        logger.info("Admin user created successfully");
    }
}