package com.example.agrolink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // 🔐 Login
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    // 👤 Role filtering (paginated)
    Page<User> findByRole(Role role, Pageable pageable);

    // 🔍 Search
    Page<User> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // 📍 Location filter (paginated)
    Page<User> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    // 🔄 Combined filter (VERY useful)
    Page<User> findByRoleAndLocationContainingIgnoreCase(
            Role role,
            String location,
            Pageable pageable
    );
}