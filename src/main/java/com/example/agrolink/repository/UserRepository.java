package com.example.agrolink.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // ================== AUTH ==================

    // 🔐 Login (case-insensitive)
    Optional<User> findByEmailIgnoreCase(String email);

    // 🔐 Check existing email
    boolean existsByEmailIgnoreCase(String email);

    // ================== ADMIN ==================

    // 👤 Filter by role
    Page<User> findByRole(Role role, Pageable pageable);

    // 📍 Filter by location
    Page<User> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    // 🔍 Search by name
    Page<User> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // ================== COMBINED FILTERS ==================

    // 👤 + 📍 Role + location
    Page<User> findByRoleAndLocationContainingIgnoreCase(
            Role role,
            String location,
            Pageable pageable
    );

    // 👤 + 🔍 Role + name
    Page<User> findByRoleAndNameContainingIgnoreCase(
            Role role,
            String name,
            Pageable pageable
    );

    // 🔍 + 📍 Name + location
    Page<User> findByNameContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String name,
            String location,
            Pageable pageable
    );

    // ================== DASHBOARD ==================

    // 📊 Count by role (useful for admin stats)
    long countByRole(Role role);
}