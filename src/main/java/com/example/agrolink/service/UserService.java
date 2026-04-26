package com.example.agrolink.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;
import com.example.agrolink.mapper.UserMapper;
import com.example.agrolink.mapper.UserRegisterMapper;
import com.example.agrolink.repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // ================== REGISTER ==================
    @Transactional
    public UserDTO register(UserRegisterDTO dto) {

        if (dto.getEmail() == null || dto.getPassword() == null) {
            throw new IllegalArgumentException("Invalid user data");
        }

        String email = dto.getEmail().toLowerCase().trim();

        logger.info("Registering user: {}", email);

        if (repo.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        // 🔒 Password validation (basic)
        if (dto.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        User user = UserRegisterMapper.toEntity(dto);

        user.setEmail(email);
        user.setPassword(encoder.encode(dto.getPassword()));

        if (user.getRole() == null) {
            user.setRole(Role.BUYER);
        }

        User saved = repo.save(user);

        logger.info("User registered successfully: {}", email);

        return UserMapper.toDTO(saved);
    }

    // ================== FIND ==================
    public User findByEmail(String email) {

        String normalized = email.toLowerCase().trim();

        return repo.findByEmail(normalized)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}