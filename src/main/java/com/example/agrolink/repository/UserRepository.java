package com.example.agrolink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Login
    Optional<User> findByEmail(String email);

    // Register validation
    boolean existsByEmail(String email);

    // Admin features
    List<User> findByRole(Role role);

    // Search
    Page<User> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Location filter
    List<User> findByLocationContainingIgnoreCase(String location);
}