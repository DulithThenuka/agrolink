package com.example.agrolink.mapper;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.entity.Crop;

import java.util.List;

public final class CropMapper {

    private CropMapper() {
        throw new UnsupportedOperationException("Utility class");
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
                getFarmerName(crop),
                getFarmerId(crop),
                crop.isActive()
        );
    }

    // ================== LIST MAPPING ==================

    public static List<CropDTO> toDTOList(List<Crop> crops) {
        if (crops == null) return List.of();

        return crops.stream()
                .map(CropMapper::toDTO)
                .toList();
    }

    // ================== DTO → ENTITY ==================

    public static Crop toEntity(CropRequestDTO dto) {
        if (dto == null) return null;

        Crop crop = new Crop();

        apply(dto, crop);

        // ❗ farmer set in service
        // ❗ image handled separately
        // ❗ active flag handled in service

        return crop;
    }

    // ================== UPDATE ==================

    public static void updateEntity(Crop crop, CropRequestDTO dto) {
        if (crop == null || dto == null) return;

        apply(dto, crop);
    }

    // ================== SHARED LOGIC ==================

    private static void apply(CropRequestDTO dto, Crop crop) {
        crop.setName(dto.getName());
        crop.setCategory(dto.getCategory());
        crop.setLocation(dto.getLocation());
        crop.setPrice(dto.getPrice());
        crop.setQuantity(dto.getQuantity());
    }

    // ================== HELPER ==================

    private static String getFarmerName(Crop crop) {
        return crop.getFarmer() != null
                ? crop.getFarmer().getName()
                : "Unknown";
    }

    private static Long getFarmerId(Crop crop) {
        if (crop.getFarmer() == null) {
            return null;
        }

        return (Long) crop.getFarmer().getId();
    }
}