package com.example.agrolink.service;

import com.example.agrolink.dto.CropAdvisorRequestDTO;
import com.example.agrolink.dto.CropAdvisorResponseDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CropAdvisorService {

    public CropAdvisorResponseDTO analyze(CropAdvisorRequestDTO request) {
        String location = request.getLocation() != null ? request.getLocation() : "Anuradhapura";
        String soil = request.getSoilType() != null ? request.getSoilType() : "Sandy Loam";
        double acres = request.getLandSizeAcres() > 0 ? request.getLandSizeAcres() : 2.0;

        List<CropAdvisorResponseDTO.CropSuitability> crops = new ArrayList<>();
        crops.add(new CropAdvisorResponseDTO.CropSuitability("Chili", 92));
        crops.add(new CropAdvisorResponseDTO.CropSuitability("Onion", 88));
        crops.add(new CropAdvisorResponseDTO.CropSuitability("Groundnut", 81));

        BigDecimal estimatedCost = new BigDecimal("110000");
        BigDecimal minRevenue = new BigDecimal("230000");
        BigDecimal maxRevenue = new BigDecimal("290000");

        return new CropAdvisorResponseDTO(
            "Chili",
            "90–120 days",
            estimatedCost,
            minRevenue,
            maxRevenue,
            "Medium",
            crops
        );
    }
}
