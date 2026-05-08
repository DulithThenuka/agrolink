package com.example.agrolink.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;

public interface UserRepository
        extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {

    // ================== AUTH ==================

    Optional<User> findByEmailIgnoreCase(
            String email
    );

    boolean existsByEmailIgnoreCase(
            String email
    );

    // ================== ADMIN ==================

    Page<User> findByRole(
            Role role,
            Pageable pageable
    );

    Page<User> findByLocationContainingIgnoreCase(
            String location,
            Pageable pageable
    );

    Page<User> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );

    // ================== FILTER ==================

    Page<User> findByRoleAndLocationContainingIgnoreCase(
            Role role,
            String location,
            Pageable pageable
    );

    // ================== DASHBOARD ==================

    long countByRole(Role role);
}