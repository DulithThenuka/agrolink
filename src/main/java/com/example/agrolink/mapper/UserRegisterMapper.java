package com.example.agrolink.mapper;

import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;

public final class UserRegisterMapper {

    private UserRegisterMapper() {

        throw new UnsupportedOperationException(
                "Utility class"
        );
    }

    // ================== DTO → ENTITY ==================

    public static User toEntity(
            UserRegisterDTO dto) {

        if (dto == null) {

            throw new IllegalArgumentException(
                    "Request cannot be null"
            );
        }

        validate(dto);

        User user = new User();

        user.setName(dto.getName().trim());

        user.setEmail(
                normalizeEmail(dto.getEmail())
        );

        // password encoded in service

        user.setPassword(dto.getPassword());

        // never trust role from client

        user.setRole(Role.BUYER);

        if (dto.getLocation() != null) {

            user.setLocation(
                    dto.getLocation().trim()
            );
        }

        // default account flags

        user.setEnabled(true);
        user.setAccountNonLocked(true);
        user.setAccountNonExpired(true);
        user.setCredentialsNonExpired(true);

        return user;
    }

    // ================== HELPERS ==================

    private static void validate(
            UserRegisterDTO dto) {

        if (dto.getEmail() == null ||
                dto.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }

        if (dto.getPassword() == null ||
                dto.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required"
            );
        }
    }

    private static String normalizeEmail(
            String email) {

        return email.toLowerCase().trim();
    }
}