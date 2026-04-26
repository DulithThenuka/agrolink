package com.example.agrolink.feature.user;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    // 👤 REGISTER
    UserDTO register(UserRegisterDTO dto);

    // 🔍 GET USER
    UserDTO getUserByEmail(String email);
    UserDTO getUserById(Long id);

    // ✏️ UPDATE PROFILE
    UserDTO updateUser(Long id, UserRegisterDTO dto);

    // 👥 ADMIN: LIST USERS
    Page<UserDTO> getAllUsers(Pageable pageable);

    // 🔒 ADMIN: ACCOUNT CONTROL
    void lockUser(Long userId);
    void unlockUser(Long userId);
}