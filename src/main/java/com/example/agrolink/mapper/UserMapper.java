package com.example.agrolink.mapper;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.entity.User;

import java.util.List;

public final class UserMapper {

    private UserMapper() {
        throw new UnsupportedOperationException("Utility class");
    }

    // ================== ENTITY → DTO ==================

    public static UserDTO toDTO(User user) {
        if (user == null) return null;

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getLocation()
        );
    }

    // ================== LIST MAPPING ==================

    public static List<UserDTO> toDTOList(List<User> users) {
        if (users == null) return List.of();

        return users.stream()
                .map(UserMapper::toDTO)
                .toList();
    }
}