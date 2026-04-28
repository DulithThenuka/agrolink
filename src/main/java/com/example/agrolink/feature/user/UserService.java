package com.example.agrolink.feature.user;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    // ================== AUTH ==================
    UserDTO register(UserRegisterDTO dto);

    // ================== READ ==================
    UserDTO getUserByEmail(String email);
    UserDTO getUserById(Long id);

    // ================== PROFILE ==================
    UserDTO updateUser(Long id, UserUpdateDTO dto, String currentUserEmail);

    void changePassword(String email, String oldPassword, String newPassword);

    // ================== ADMIN ==================
    Page<UserDTO> getAllUsers(Pageable pageable);

    void lockUser(Long userId);
    void unlockUser(Long userId);

    void deactivateUser(Long userId);

    UserDTO updateUser(Long id, UserRegisterDTO dto);
}