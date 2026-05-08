package com.example.agrolink.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.entity.Crop;

public final class CropMapper {

    private CropMapper() {

        throw new UnsupportedOperationException(
                "Utility class"
        );
    }

    // ================== ENTITY → DTO ==================

    public static CropDTO toDTO(Crop crop) {

        if (crop == null) {
            return null;
        }

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

    // ================== LIST ==================

    public static List<CropDTO> toDTOList(
            List<Crop> crops) {

        if (crops == null) {
            return List.of();
        }

        return crops.stream()
                .map(CropMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ================== DTO → ENTITY ==================

    public static Crop toEntity(
            CropRequestDTO dto) {

        if (dto == null) {
            return null;
        }

        Crop crop = new Crop();

        apply(dto, crop);

        return crop;
    }

    // ================== UPDATE ==================

    public static void updateEntity(
            Crop crop,
            CropRequestDTO dto) {

        if (crop == null || dto == null) {
            return;
        }

        apply(dto, crop);
    }

    // ================== SHARED ==================

    private static void apply(
            CropRequestDTO dto,
            Crop crop) {

        crop.setName(dto.getName());
        crop.setCategory(dto.getCategory());
        crop.setLocation(dto.getLocation());
        crop.setPrice(dto.getPrice());
        crop.setQuantity(dto.getQuantity());
    }

    // ================== HELPERS ==================

    private static String getFarmerName(
            Crop crop) {

        return crop.getFarmer() != null
                ? crop.getFarmer().getName()
                : "Unknown";
    }

    private static Long getFarmerId(
            Crop crop) {

        return crop.getFarmer() != null
                ? crop.getFarmer().getId()
                : null;
    }
}