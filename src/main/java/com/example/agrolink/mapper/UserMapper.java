package com.example.agrolink.mapper;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.entity.User;

public final class UserMapper {

    private UserMapper() {
        // prevent instantiation
    }

    // ================== ENTITY → DTO ==================
    public static UserDTO toDTO(User user) {
        if (user == null) return null;

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(), // ✅ FIXED
                user.getLocation()
        );
    }
}