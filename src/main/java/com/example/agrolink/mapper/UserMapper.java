package com.example.agrolink.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.entity.User;

public final class UserMapper {

    private UserMapper() {

        throw new UnsupportedOperationException(
                "Utility class"
        );
    }

    // ================== ENTITY → DTO ==================

    public static UserDTO toDTO(User user) {

        if (user == null) {
            return null;
        }

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getLocation(),
                user.isEnabled()
        );
    }

    // ================== LIST ==================

    public static List<UserDTO> toDTOList(
            List<User> users) {

        if (users == null) {
            return List.of();
        }

        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }
}