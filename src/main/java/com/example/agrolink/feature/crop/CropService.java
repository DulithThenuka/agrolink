package com.example.agrolink.feature.crop;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;

public interface CropService {

    // ================== CREATE ==================

    CropDTO createCrop(
            CropRequestDTO dto,
            String farmerEmail
    );

    // ================== SEARCH ==================

    Page<CropDTO> searchCrops(
            String keyword,
            String category,
            String location,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    );

    // ================== READ ==================

    CropDTO getCropById(Long id);

    // ================== UPDATE ==================

    CropDTO updateCrop(
            Long id,
            CropRequestDTO dto,
            String farmerEmail
    );

    // ================== DELETE ==================

    void softDelete(
            Long id,
            String farmerEmail
    );

    // ================== ADMIN ==================

    void restoreCrop(Long id);
}