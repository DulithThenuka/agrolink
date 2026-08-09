package com.example.agrolink.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.FarmerProfileDTO;
import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;
import com.example.agrolink.mapper.CropMapper;
import com.example.agrolink.mapper.UserMapper;
import com.example.agrolink.mapper.UserRegisterMapper;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.UserRepository;

import java.util.List;

@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final int MIN_PASSWORD_LENGTH = 6;

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final CropRepository cropRepository;

    public UserService(UserRepository repo, PasswordEncoder encoder, CropRepository cropRepository) {
        this.repo = repo;
        this.encoder = encoder;
        this.cropRepository = cropRepository;
    }

    // ================== REGISTER ==================

    public UserDTO register(
            UserRegisterDTO dto) {

        validateRegisterRequest(dto);

        String email =
                normalizeEmail(
                        dto.getEmail()
                );

        logger.info(
                "Registering user: {}",
                email
        );

        if (repo.existsByEmailIgnoreCase(
                email
        )) {

            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        User user =
                UserRegisterMapper
                        .toEntity(dto);

        user.setEmail(email);

        user.setPassword(
                encodePassword(
                        dto.getPassword()
                )
        );

        user.setRole(
                resolveRole(user)
        );

        User savedUser =
                repo.save(user);

        logger.info(
                "User registered successfully: id={}, email={}",
                savedUser.getId(),
                email
        );

        return UserMapper.toDTO(
                savedUser
        );
    }

    // ================== FIND ==================

    @Transactional(readOnly = true)
    public User findByEmail(
            String email) {

        String normalized =
                normalizeEmail(
                        email
                );

        return repo
                .findByEmailIgnoreCase(
                        normalized
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }

    @Transactional(readOnly = true)
    public FarmerProfileDTO getFarmerProfile(Long farmerId) {
        User farmer = repo.findById(farmerId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer not found with ID: " + farmerId));

        List<Crop> crops = cropRepository.findByFarmerIdAndActiveTrue(farmerId);
        List<CropDTO> cropDTOs = CropMapper.toDTOList(crops);

        int memberSince = farmer.getCreatedAt() != null ? farmer.getCreatedAt().getYear() : 2026;

        return new FarmerProfileDTO(
                farmer.getId(),
                farmer.getName(),
                farmer.getEmail(),
                farmer.isVerified(),
                farmer.getDistrict(),
                memberSince,
                farmer.getCompletedOrdersCount(),
                farmer.getOverallRating(),
                farmer.getOnTimeDeliveryRate(),
                farmer.getProductQualityRating(),
                farmer.getBuyerSatisfactionRate(),
                cropDTOs.size(),
                cropDTOs
        );
    }

    // ================== HELPERS ==================

    private void validateRegisterRequest(
            UserRegisterDTO dto) {

        if (dto == null) {

            throw new IllegalArgumentException(
                    "Request cannot be null"
            );
        }

        if (dto.getEmail() == null
                || dto.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }

        if (dto.getPassword() == null
                || dto.getPassword()
                .length()
                < MIN_PASSWORD_LENGTH) {

            throw new IllegalArgumentException(
                    "Password must be at least "
                            + MIN_PASSWORD_LENGTH
                            + " characters"
            );
        }
    }

    private String normalizeEmail(
            String email) {

        return email == null
                ? ""
                : email.toLowerCase()
                        .trim();
    }

    private String encodePassword(
            String rawPassword) {

        return encoder.encode(
                rawPassword
        );
    }

    private Role resolveRole(
            User user) {

        return user.getRole() == null
                ? Role.BUYER
                : user.getRole();
    }
}