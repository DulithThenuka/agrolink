package com.example.agrolink.feature.crop;

import com.example.agrolink.dto.*;
import com.example.agrolink.entity.*;
import com.example.agrolink.exception.ResourceNotFoundException;
import com.example.agrolink.mapper.CropMapper;
import com.example.agrolink.repository.*;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropServiceImpl(CropRepository cropRepository,
                           UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ================== CREATE ==================
    @Override
    public CropDTO addCrop(CropRequestDTO dto, String email) {

        dto.normalize();

        User farmer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Crop crop = CropMapper.toEntity(dto);
        crop.setFarmer(farmer);
        crop.setActive(true);

        return CropMapper.toDTO(cropRepository.save(crop));
    }

    // ================== SEARCH ==================
    @Override
    @Transactional(readOnly = true)
    public Page<CropDTO> searchCrops(String keyword,
                                     String category,
                                     String location,
                                     BigDecimal minPrice,
                                     BigDecimal maxPrice,
                                     Pageable pageable) {

        String safeKeyword = keyword == null ? "" : keyword;
        String safeCategory = category == null ? "" : category;
        String safeLocation = location == null ? "" : location;

        BigDecimal min = minPrice == null ? BigDecimal.ZERO : minPrice;
        BigDecimal max = maxPrice == null ? new BigDecimal("999999999") : maxPrice;

        return cropRepository.searchCrops(
                safeKeyword,
                safeCategory,
                safeLocation,
                min,
                max,
                pageable
        ).map(CropMapper::toDTO);
    }

    // ================== GET BY ID ==================
    @Override
    @Transactional(readOnly = true)
    public CropDTO getCropById(Long id) {
        return CropMapper.toDTO(getCropOrThrow(id));
    }

    // ================== UPDATE ==================
    @Override
    public CropDTO updateCrop(Long id, CropRequestDTO dto, String email) {

        dto.normalize();

        Crop crop = getCropOrThrow(id);

        // 🔐 ownership check
        if (crop.getFarmer() == null ||
            !crop.getFarmer().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Unauthorized action");
        }

        CropMapper.updateEntity(crop, dto);

        return CropMapper.toDTO(cropRepository.save(crop));
    }

    // ================== DELETE ==================
    @Override
    public void deleteCrop(Long id, String email) {

        Crop crop = getCropOrThrow(id);

        if (crop.getFarmer() == null ||
            !crop.getFarmer().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Unauthorized action");
        }

        crop.setActive(false);
        cropRepository.save(crop);
    }

    // ================== RESTORE ==================
    @Override
    public void restoreCrop(Long id) {

        Crop crop = getCropOrThrow(id);
        crop.setActive(true);
        cropRepository.save(crop);
    }

    // ================== HELPER ==================
    private Crop getCropOrThrow(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found"));
    }
}