package com.example.agrolink.config;

import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Value;

@Component
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);
    private static final int MIN_PASSWORD_LENGTH = 6;

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

    @Override
    @Transactional
    public void run(String... args) {

        if (!hasValidCredentials()) {
            logger.warn("Admin credentials not configured. Skipping admin creation.");
            return;
        }

        String normalizedEmail = normalizeEmail(adminEmail);

        userRepository.findByEmailIgnoreCase(normalizedEmail)
                .ifPresentOrElse(
                        user -> logger.info("Admin already exists: {}", normalizedEmail),
                        () -> createAdminUser(normalizedEmail)
                );
    }

    // ================== HELPERS ==================

    private boolean hasValidCredentials() {

        if (!StringUtils.hasText(adminEmail) || !StringUtils.hasText(adminPassword)) {
            return false;
        }

        if (adminPassword.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException(
                    "Admin password must be at least " + MIN_PASSWORD_LENGTH + " characters"
            );
        }

        return true;
    }

    private String normalizeEmail(String email) {
        return email.toLowerCase().trim();
    }

    private void createAdminUser(String email) {

        logger.info("Creating default admin user: {}", email);

        User admin = new User();
        admin.setName("Admin");
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        admin.setLocation("System");

        // Account flags
        admin.setEnabled(true);
        admin.setAccountNonLocked(true);
        admin.setAccountNonExpired(true);
        admin.setCredentialsNonExpired(true);

        userRepository.save(admin);

        logger.info("Admin user created successfully: {}", email);
    }
}