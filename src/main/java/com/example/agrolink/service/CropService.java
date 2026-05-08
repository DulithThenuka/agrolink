package com.example.agrolink.service;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.User;
import com.example.agrolink.mapper.CropMapper;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.UserRepository;

@Service
@Transactional
public class CropService {

    private static final Logger logger =
            LoggerFactory.getLogger(CropService.class);

    private static final BigDecimal DEFAULT_MAX_PRICE =
            new BigDecimal("999999999");

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropService(
            CropRepository cropRepository,
            UserRepository userRepository) {

        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ================== CREATE ==================

    public CropDTO createCrop(
            CropRequestDTO dto,
            String email) {

        logger.info(
                "Creating crop for user: {}",
                email
        );

        dto.normalize();

        User farmer = getUserByEmail(email);

        validateCropRequest(dto);

        Crop crop = CropMapper.toEntity(dto);

        crop.setFarmer(farmer);
        crop.setActive(true);

        Crop savedCrop =
                cropRepository.save(crop);

        logger.info(
                "Crop created successfully with ID: {}",
                savedCrop.getId()
        );

        return CropMapper.toDTO(savedCrop);
    }

    // ================== GET ALL ==================

    @Transactional(readOnly = true)
    public Page<CropDTO> getAllActiveCrops(
            Pageable pageable) {

        return cropRepository
                .findByActiveTrue(pageable)
                .map(CropMapper::toDTO);
    }

    // ================== SEARCH ==================

    @Transactional(readOnly = true)
    public Page<CropDTO> searchCrops(
            String keyword,
            String category,
            String location,
            Double minPrice,
            Double maxPrice,
            Pageable pageable) {

        return cropRepository.searchCrops(
                        normalize(keyword),
                        normalize(category),
                        normalize(location),
                        toMinPrice(minPrice),
                        toMaxPrice(maxPrice),
                        pageable
                )
                .map(CropMapper::toDTO);
    }

    // ================== GET BY ID ==================

    @Transactional(readOnly = true)
    public CropDTO getById(Long id) {

        return CropMapper.toDTO(
                getCropOrThrow(id)
        );
    }

    // ================== DELETE ==================

    public void softDelete(
            Long id,
            String email) {

        logger.info(
                "Soft deleting crop {} by user {}",
                id,
                email
        );

        Crop crop = getCropOrThrow(id);

        if (!isOwner(crop, email)) {

            throw new IllegalArgumentException(
                    "Unauthorized action"
            );
        }

        crop.setActive(false);

        cropRepository.save(crop);
    }

    // ================== RESTORE ==================

    public void restore(Long id) {

        logger.info("Restoring crop {}", id);

        Crop crop = getCropOrThrow(id);

        crop.setActive(true);

        cropRepository.save(crop);
    }

    // ================== HELPERS ==================

    private User getUserByEmail(
            String email) {

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }

    private Crop getCropOrThrow(
            Long id) {

        return cropRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Crop not found"
                        )
                );
    }

    private void validateCropRequest(
            CropRequestDTO dto) {

        if (dto.getPrice() == null ||
                dto.getPrice()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Price must be positive"
            );
        }

        if (dto.getQuantity() < 0) {

            throw new IllegalArgumentException(
                    "Quantity cannot be negative"
            );
        }
    }

    private boolean isOwner(
            Crop crop,
            String email) {

        return crop.getFarmer() != null
                && crop.getFarmer()
                        .getEmail()
                        .equalsIgnoreCase(email);
    }

    private String normalize(
            String value) {

        return value == null
                ? ""
                : value.trim();
    }

    private BigDecimal toMinPrice(
            Double value) {

        return value == null
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(value);
    }

    private BigDecimal toMaxPrice(
            Double value) {

        return value == null
                ? DEFAULT_MAX_PRICE
                : BigDecimal.valueOf(value);
    }
}