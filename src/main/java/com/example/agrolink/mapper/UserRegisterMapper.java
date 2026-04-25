package com.example.agrolink.mapper;

import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;

public class UserRegisterMapper {

    public static User toEntity(UserRegisterDTO dto) {
        if (dto == null) return null;

        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail().toLowerCase().trim());

        // ✅ NEVER take role from user input
        user.setRole(Role.BUYER);

        // ⚠️ raw password (encode in service)
        user.setPassword(dto.getPassword());

        return user;
    }
}