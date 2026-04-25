package com.example.agrolink.mapper;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.entity.User;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        if (user == null) return null;

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(), // ✅ enum → string
                user.getLocation()
        );
    }
}