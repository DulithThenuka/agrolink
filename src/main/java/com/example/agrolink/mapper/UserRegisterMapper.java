package com.example.agrolink.mapper;

import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;

public final class UserRegisterMapper {

    private UserRegisterMapper() {
        // prevent instantiation
    }

    public static User toEntity(UserRegisterDTO dto) {
        if (dto == null) return null;

        User user = new User();

        // ✅ Safe email handling
        String email = dto.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        user.setName(dto.getName());
        user.setEmail(email.toLowerCase().trim());

        // 🔒 NEVER trust role from client
        user.setRole(Role.BUYER);

        // ⚠️ Raw password (will be encoded in service layer)
        user.setPassword(dto.getPassword());

        // ✅ Optional defaults (clear intent)
        user.setEnabled(true);
        user.setAccountNonLocked(true);

        return user;
    }
}