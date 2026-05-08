package com.example.agrolink.feature.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.entity.User;

public interface UserService {

    // ================== AUTH ==================

    UserDTO register(UserRegisterDTO dto);

    User findByEmail(String email);

    // ================== READ ==================

    UserDTO getUserByEmail(String email);

    UserDTO getUserById(Long id);

    // ================== PROFILE ==================

    UserDTO updateUser(
            Long id,
            UserRegisterDTO dto,
            String currentUserEmail
    );

    void changePassword(
            String email,
            String oldPassword,
            String newPassword
    );

    // ================== ADMIN ==================

    Page<UserDTO> getAllUsers(Pageable pageable);

    void lockUser(Long userId);

    void unlockUser(Long userId);

    void deactivateUser(Long userId);
}