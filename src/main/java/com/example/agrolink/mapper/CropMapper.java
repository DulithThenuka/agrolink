package com.example.agrolink.mapper;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.entity.Crop;

public class CropMapper {

    // ✅ ENTITY → DTO
    public static CropDTO toDTO(Crop crop) {
        if (crop == null) return null;

        return new CropDTO(
                crop.getId(),
                crop.getName(),
                crop.getCategory(),
                crop.getLocation(),
                crop.getPrice(),
                crop.getQuantity(),
                crop.getImageUrl(), // ✅ FIXED
                crop.getFarmer() != null ? crop.getFarmer().getName() : null
        );
    }

    // ✅ REQUEST DTO → ENTITY
    public static Crop toEntity(CropRequestDTO dto) {
        if (dto == null) return null;

        Crop crop = new Crop();
        crop.setName(dto.getName());
        crop.setCategory(dto.getCategory());
        crop.setLocation(dto.getLocation());
        crop.setPrice(dto.getPrice());
        crop.setQuantity(dto.getQuantity());

        // ❗ farmer set in service
        return crop;
    }
}