package com.example.agrolink.service;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.User;
import com.example.agrolink.mapper.CropMapper;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.UserRepository;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropService(CropRepository cropRepository,
                       UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ✅ CREATE
    public CropDTO createCrop(CropRequestDTO dto, String email) {

        User farmer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Crop crop = CropMapper.toEntity(dto);
        crop.setFarmer(farmer);

        return CropMapper.toDTO(cropRepository.save(crop));
    }

    // ✅ GET ALL
    public Page<CropDTO> getAllActiveCrops(Pageable pageable) {
        return cropRepository.findByActiveTrue(pageable)
                .map(CropMapper::toDTO);
    }

    // ✅ SEARCH
    public Page<CropDTO> searchCrops(String keyword,
                                     String category,
                                     String location,
                                     Double minPrice,
                                     Double maxPrice,
                                     Pageable pageable) {

        BigDecimal min = (minPrice == null) ? null : BigDecimal.valueOf(minPrice);
        BigDecimal max = (maxPrice == null) ? null : BigDecimal.valueOf(maxPrice);

        return cropRepository.searchCrops(
                        keyword,
                        category,
                        location,
                        min,
                        max,
                        pageable
                )
                .map(CropMapper::toDTO);
    }

    // ✅ GET BY ID
    public CropDTO getById(Long id) {
        return CropMapper.toDTO(
                cropRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Crop not found"))
        );
    }

    // ✅ SOFT DELETE (with ownership check)
    public void softDelete(Long id, String email) {

        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found"));

        if (!crop.getFarmer().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Unauthorized action");
        }

        crop.setActive(false);
        cropRepository.save(crop);
    }

    // ✅ RESTORE
    public void restore(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found"));

        crop.setActive(true);
        cropRepository.save(crop);
    }
}