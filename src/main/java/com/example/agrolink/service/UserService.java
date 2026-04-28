package com.example.agrolink.service;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;
import com.example.agrolink.mapper.UserMapper;
import com.example.agrolink.mapper.UserRegisterMapper;
import com.example.agrolink.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final int MIN_PASSWORD_LENGTH = 6;

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // ================== REGISTER ==================
    @Transactional
    public UserDTO register(UserRegisterDTO dto) {

        validateRegisterRequest(dto);

        String email = normalizeEmail(dto.getEmail());

        logger.info("Registering user: {}", email);

        if (repo.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = UserRegisterMapper.toEntity(dto);

        user.setEmail(email);
        user.setPassword(encodePassword(dto.getPassword()));
        user.setRole(resolveRole(user));

        User savedUser = repo.save(user);

        logger.info("User registered successfully: id={}, email={}",
                savedUser.getId(), email);

        return UserMapper.toDTO(savedUser);
    }

    // ================== FIND ==================
    public User findByEmail(String email) {

        String normalized = normalizeEmail(email);

        return ((Object) repo.findByEmail(normalized))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // ================== HELPERS ==================

    private void validateRegisterRequest(UserRegisterDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (dto.getPassword() == null || dto.getPassword().length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException(
                    "Password must be at least " + MIN_PASSWORD_LENGTH + " characters"
            );
        }
    }

    private String normalizeEmail(String email) {
        return email.toLowerCase().trim();
    }

    private String encodePassword(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    private Object resolveRole(User user) {
        return (user.getRole() == null) ? Role.BUYER : user.getRole();
    }
}