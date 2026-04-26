package com.example.agrolink.feature.crop;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface CropService {

    // 🌾 CREATE
    CropDTO addCrop(CropRequestDTO dto, String farmerEmail);

    // 🔍 SEARCH
    Page<CropDTO> searchCrops(String keyword,
                              String category,
                              String location,
                              BigDecimal minPrice,
                              BigDecimal maxPrice,
                              Pageable pageable);

    // 📄 GET BY ID
    CropDTO getCropById(Long id);

    // ✏️ UPDATE
    CropDTO updateCrop(Long id, CropRequestDTO dto, String farmerEmail);

    // ❌ DELETE (soft delete with ownership)
    void deleteCrop(Long id, String farmerEmail);

    // ♻️ RESTORE (admin feature)
    void restoreCrop(Long id);
}