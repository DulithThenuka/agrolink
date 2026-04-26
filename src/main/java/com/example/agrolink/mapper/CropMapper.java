package com.example.agrolink.mapper;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.entity.Crop;

public final class CropMapper {

    private CropMapper() {
        // prevent instantiation
    }

    // ================== ENTITY → DTO ==================
    public static CropDTO toDTO(Crop crop) {
        if (crop == null) return null;

        return new CropDTO(
                crop.getId(),
                crop.getName(),
                crop.getCategory(),
                crop.getLocation(),
                crop.getPrice(),
                crop.getQuantity(),
                crop.getImageUrl(),
                getFarmerName(crop)
        );
    }

    // ================== DTO → ENTITY ==================
    public static Crop toEntity(CropRequestDTO dto) {
        if (dto == null) return null;

        Crop crop = new Crop();
        crop.setName(dto.getName());
        crop.setCategory(dto.getCategory());
        crop.setLocation(dto.getLocation());
        crop.setPrice(dto.getPrice());
        crop.setQuantity(dto.getQuantity());

        // ❗ farmer set in service
        // ❗ image handled separately

        return crop;
    }

    // ================== UPDATE ==================
    public static void updateEntity(Crop crop, CropRequestDTO dto) {
        if (crop == null || dto == null) return;

        crop.setName(dto.getName());
        crop.setCategory(dto.getCategory());
        crop.setLocation(dto.getLocation());
        crop.setPrice(dto.getPrice());
        crop.setQuantity(dto.getQuantity());
    }

    // ================== HELPER ==================
    private static String getFarmerName(Crop crop) {
        return (crop.getFarmer() != null) ? crop.getFarmer().getName() : null;
    }
}