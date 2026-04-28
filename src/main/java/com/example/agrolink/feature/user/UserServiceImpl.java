package com.example.agrolink.feature.user;

import com.example.agrolink.dto.*;
import com.example.agrolink.entity.User;
import com.example.agrolink.exception.ResourceNotFoundException;
import com.example.agrolink.mapper.*;
import com.example.agrolink.repository.UserRepository;

import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================== REGISTER ==================
    @Override
    public UserDTO register(UserRegisterDTO dto) {

        String email = dto.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (dto.getPassword() == null || dto.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        User user = UserRegisterMapper.toEntity(dto);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return UserMapper.toDTO(userRepository.save(user));
    }

    // ================== GET BY EMAIL ==================
    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserMapper.toDTO(user);
    }

    // ================== GET BY ID ==================
    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserMapper.toDTO(user);
    }

    // ================== UPDATE ==================
    @Override
    public UserDTO updateUser(Long id, UserRegisterDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getName() != null) {
            user.setName(dto.getName().trim());
        }

        if (dto.getLocation() != null) {
            user.setLocation(dto.getLocation().trim());
        }

        return UserMapper.toDTO(userRepository.save(user));
    }

    // ================== ADMIN: GET ALL ==================
    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable) {

        return userRepository.findAll(pageable)
                .map(UserMapper::toDTO);
    }

    // ================== LOCK USER ==================
    @Override
    public void lockUser(Long userId) {

        User user = getUserOrThrow(userId);
        user.setAccountNonLocked(false);
        userRepository.save(user);
    }

    // ================== UNLOCK USER ==================
    @Override
    public void unlockUser(Long userId) {

        User user = getUserOrThrow(userId);
        user.setAccountNonLocked(true);
        userRepository.save(user);
    }

    // ================== HELPER ==================
    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public UserDTO updateUser(Long id, UserUpdateDTO dto, String currentUserEmail) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void changePassword(String email, String oldPassword, String newPassword) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void deactivateUser(Long userId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}