package com.example.agrolink.feature.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.entity.User;
import com.example.agrolink.exception.ResourceNotFoundException;
import com.example.agrolink.mapper.UserMapper;
import com.example.agrolink.mapper.UserRegisterMapper;
import com.example.agrolink.repository.UserRepository;

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

        dto.normalize();

        String email = dto.getEmail();

        if (userRepository.existsByEmailIgnoreCase(email)) {

            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        if (dto.getPassword() == null ||
                dto.getPassword().length() < 6) {

            throw new IllegalArgumentException(
                    "Password must be at least 6 characters"
            );
        }

        User user = UserRegisterMapper.toEntity(dto);

        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(dto.getPassword())
        );

        User savedUser = userRepository.save(user);

        return UserMapper.toDTO(savedUser);
    }

    // ================== INTERNAL ==================

    @Override
    @Transactional(readOnly = true)
    public User findByEmail(String email) {

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }

    // ================== GET BY EMAIL ==================

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {

        return UserMapper.toDTO(
                findByEmail(email)
        );
    }

    // ================== GET BY ID ==================

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {

        User user = getUserOrThrow(id);

        return UserMapper.toDTO(user);
    }

    // ================== UPDATE ==================

    @Override
    public UserDTO updateUser(
            Long id,
            UserRegisterDTO dto,
            String currentUserEmail) {

        User user = getUserOrThrow(id);

        // ownership/security check

        if (!user.getEmail()
                .equalsIgnoreCase(currentUserEmail)) {

            throw new IllegalArgumentException(
                    "Unauthorized action"
            );
        }

        if (dto.getName() != null) {
            user.setName(dto.getName().trim());
        }

        if (dto.getLocation() != null) {
            user.setLocation(dto.getLocation().trim());
        }

        User updatedUser = userRepository.save(user);

        return UserMapper.toDTO(updatedUser);
    }

    // ================== PASSWORD ==================

    @Override
    public void changePassword(
            String email,
            String oldPassword,
            String newPassword) {

        User user = findByEmail(email);

        if (!passwordEncoder.matches(
                oldPassword,
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Old password is incorrect"
            );
        }

        if (newPassword == null ||
                newPassword.length() < 6) {

            throw new IllegalArgumentException(
                    "New password must be at least 6 characters"
            );
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
    }

    // ================== ADMIN ==================

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(
            Pageable pageable) {

        return userRepository.findAll(pageable)
                .map(UserMapper::toDTO);
    }

    @Override
    public void lockUser(Long userId) {

        User user = getUserOrThrow(userId);

        user.setAccountNonLocked(false);

        userRepository.save(user);
    }

    @Override
    public void unlockUser(Long userId) {

        User user = getUserOrThrow(userId);

        user.setAccountNonLocked(true);

        userRepository.save(user);
    }

    @Override
    public void deactivateUser(Long userId) {

        User user = getUserOrThrow(userId);

        user.disable();

        userRepository.save(user);
    }

    // ================== HELPERS ==================

    private User getUserOrThrow(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }
}