package com.example.agrolink.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Transactional
    public User register(User user) {

        if (user.getEmail() == null || user.getPassword() == null) {
            throw new RuntimeException("Invalid user data");
        }

        if (repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (user.getRole() == null) {
            user.setRole(Role.BUYER);
        }

        user.setPassword(encoder.encode(user.getPassword()));

        return repo.save(user);
    }

    public User findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}