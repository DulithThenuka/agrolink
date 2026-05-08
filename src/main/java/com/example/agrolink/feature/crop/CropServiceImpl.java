package com.example.agrolink.feature.crop;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.User;
import com.example.agrolink.exception.ResourceNotFoundException;
import com.example.agrolink.mapper.CropMapper;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.UserRepository;

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
    public CropDTO createCrop(
            CropRequestDTO dto,
            String farmerEmail) {

        dto.normalize();

        User farmer = userRepository
                .findByEmailIgnoreCase(farmerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Crop crop = CropMapper.toEntity(dto);

        crop.setFarmer(farmer);
        crop.setActive(true);

        Crop savedCrop = cropRepository.save(crop);

        return CropMapper.toDTO(savedCrop);
    }

    // ================== SEARCH ==================

    @Override
    @Transactional(readOnly = true)
    public Page<CropDTO> searchCrops(
            String keyword,
            String category,
            String location,
            Double minPrice,
            Double maxPrice,
            Pageable pageable) {

        String safeKeyword =
                keyword == null ? "" : keyword.trim();

        String safeCategory =
                category == null ? "" : category.trim();

        String safeLocation =
                location == null ? "" : location.trim();

        BigDecimal min =
                minPrice == null
                        ? BigDecimal.ZERO
                        : BigDecimal.valueOf(minPrice);

        BigDecimal max =
                maxPrice == null
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

    @Override
    @Transactional(readOnly = true)
    public CropDTO getCropById(Long id) {

        return CropMapper.toDTO(
                getCropOrThrow(id)
        );
    }

    // ================== UPDATE ==================

    @Override
    public CropDTO updateCrop(
            Long id,
            CropRequestDTO dto,
            String farmerEmail) {

        dto.normalize();

        Crop crop = getCropOrThrow(id);

        validateOwnership(crop, farmerEmail);

        CropMapper.updateEntity(crop, dto);

        Crop updatedCrop = cropRepository.save(crop);

        return CropMapper.toDTO(updatedCrop);
    }

    // ================== DELETE ==================

    @Override
    public void softDelete(
            Long id,
            String farmerEmail) {

        Crop crop = getCropOrThrow(id);

        validateOwnership(crop, farmerEmail);

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

    // ================== HELPERS ==================

    private Crop getCropOrThrow(Long id) {

        return cropRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Crop not found"
                        ));
    }

    private void validateOwnership(
            Crop crop,
            String farmerEmail) {

        if (crop.getFarmer() == null ||
                crop.getFarmer().getEmail() == null ||
                !crop.getFarmer()
                        .getEmail()
                        .equalsIgnoreCase(farmerEmail)) {

            throw new IllegalArgumentException(
                    "Unauthorized action"
            );
        }
    }
}