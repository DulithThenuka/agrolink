package com.example.agrolink.service;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.User;
import com.example.agrolink.mapper.CropMapper;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class CropService {

    private static final Logger logger = LoggerFactory.getLogger(CropService.class);

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropService(CropRepository cropRepository,
                       UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ================== CREATE ==================
    @Transactional
    public CropDTO createCrop(CropRequestDTO dto, String email) {

        logger.info("Creating crop for user: {}", email);

        User farmer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // ✅ Validation
        if (dto.getPrice() == null || dto.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price must be positive");
        }

        if (dto.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        Crop crop = CropMapper.toEntity(dto);
        crop.setFarmer(farmer);
        crop.setActive(true);

        return CropMapper.toDTO(cropRepository.save(crop));
    }

    // ================== GET ALL ==================
    public Page<CropDTO> getAllActiveCrops(Pageable pageable) {
        return cropRepository.findByActiveTrue(pageable)
                .map(CropMapper::toDTO);
    }

    // ================== SEARCH ==================
    public Page<CropDTO> searchCrops(String keyword,
                                     String category,
                                     String location,
                                     Double minPrice,
                                     Double maxPrice,
                                     Pageable pageable) {

        String safeKeyword = (keyword == null) ? "" : keyword;
        String safeCategory = (category == null) ? "" : category;
        String safeLocation = (location == null) ? "" : location;

        BigDecimal min = (minPrice == null)
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(minPrice);

        BigDecimal max = (maxPrice == null)
                ? new BigDecimal("999999999")
                : BigDecimal.valueOf(maxPrice);

        return cropRepository.searchCrops(
                        safeKeyword,
                        safeCategory,
                        safeLocation,
                        min,
                        max,
                        pageable
                )
                .map(CropMapper::toDTO);
    }

    // ================== GET BY ID ==================
    public CropDTO getById(Long id) {
        return CropMapper.toDTO(getCropOrThrow(id));
    }

    // ================== SOFT DELETE ==================
    @Transactional
    public void softDelete(Long id, String email) {

        logger.info("Soft deleting crop {} by user {}", id, email);

        Crop crop = getCropOrThrow(id);

        if (crop.getFarmer() == null ||
            !crop.getFarmer().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Unauthorized action");
        }

        crop.setActive(false);
        cropRepository.save(crop);
    }

    // ================== RESTORE ==================
    @Transactional
    public void restore(Long id) {

        logger.info("Restoring crop {}", id);

        Crop crop = getCropOrThrow(id);
        crop.setActive(true);

        cropRepository.save(crop);
    }

    // ================== HELPER ==================
    private Crop getCropOrThrow(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found"));
    }
}