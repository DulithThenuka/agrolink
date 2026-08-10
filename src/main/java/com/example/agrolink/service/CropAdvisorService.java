package com.example.agrolink.service;

import com.example.agrolink.dto.CropAdvisorRequestDTO;
import com.example.agrolink.dto.CropAdvisorResponseDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class CropAdvisorService {

    public CropAdvisorResponseDTO analyze(CropAdvisorRequestDTO request) {
        String location = request.getLocation() != null && !request.getLocation().isBlank() ? request.getLocation().trim() : "Anuradhapura";
        String soil = request.getSoilType() != null && !request.getSoilType().isBlank() ? request.getSoilType().trim() : "Red-Brown Earth";
        double acres = request.getLandSizeAcres() > 0 ? request.getLandSizeAcres() : 1.5;
        String water = request.getWaterAvailability() != null && !request.getWaterAvailability().isBlank() ? request.getWaterAvailability().trim() : "Canal / Reservoir";
        String month = request.getMonth() != null && !request.getMonth().isBlank() ? request.getMonth().trim() : "October (Maha Season)";
        BigDecimal budget = (request.getBudgetLkr() != null && request.getBudgetLkr().compareTo(BigDecimal.ZERO) > 0) 
            ? request.getBudgetLkr() 
            : new BigDecimal("150000");

        // Dynamic Agro-Ecological Matrix for Sri Lankan Districts
        String locLower = location.toLowerCase();
        boolean isHighlandCool = locLower.contains("nuwara eliya") || locLower.contains("badulla") || locLower.contains("bandarawela");
        boolean isDryZone = locLower.contains("anuradhapura") || locLower.contains("polonnaruwa") || locLower.contains("hambantota") || locLower.contains("monaragala") || locLower.contains("vavuniya");
        boolean isJaffnaPeninsula = locLower.contains("jaffna") || locLower.contains("kilinochchi") || locLower.contains("mannar");
        boolean isWetZoneLowland = locLower.contains("colombo") || locLower.contains("gampaha") || locLower.contains("kalutara") || locLower.contains("galle") || locLower.contains("matara");

        List<CropAdvisorResponseDTO.CropSuitability> crops = new ArrayList<>();
        String bestRecommendation;
        String harvestPeriod;
        BigDecimal costPerAcre;
        BigDecimal yieldMinKg;
        BigDecimal yieldMaxKg;
        BigDecimal pricePerKg;
        String riskLevel;

        if (isHighlandCool) {
            // Nuwara Eliya / Upcountry cool climate
            bestRecommendation = "Potato";
            harvestPeriod = "80–100 days (Upcountry Maha)";
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Potato", 95));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Carrot", 91));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Leeks", 86));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Cabbage", 82));
            costPerAcre = new BigDecimal("240000");
            yieldMinKg = new BigDecimal("8500");
            yieldMaxKg = new BigDecimal("11500");
            pricePerKg = new BigDecimal("290");
            riskLevel = "Low-Moderate";
        } else if (isJaffnaPeninsula) {
            // Arid / Calc red soils in Northern Province
            bestRecommendation = "Red Onion";
            harvestPeriod = "70–90 days (Yala / Late Dry)";
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Red Onion", 94));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Chili (Green)", 89));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Cassava", 84));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Grape", 78));
            costPerAcre = new BigDecimal("180000");
            yieldMinKg = new BigDecimal("6000");
            yieldMaxKg = new BigDecimal("8200");
            pricePerKg = new BigDecimal("380");
            riskLevel = "Moderate";
        } else if (isWetZoneLowland) {
            // Colombo / Gampaha / Kalutara wet zone
            bestRecommendation = "Pineapple";
            harvestPeriod = "12–14 months (Perennial Cycle)";
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Pineapple", 93));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Gotukola / Leafy Greens", 88));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Passion Fruit", 84));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Banana", 80));
            costPerAcre = new BigDecimal("130000");
            yieldMinKg = new BigDecimal("7000");
            yieldMaxKg = new BigDecimal("9500");
            pricePerKg = new BigDecimal("180");
            riskLevel = "Low";
        } else {
            // Default / Dry Zone (Anuradhapura, Polonnaruwa, Kurunegala, etc.)
            bestRecommendation = "Chili";
            harvestPeriod = "90–110 days (Dry Zone Major)";
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Chili (Green)", 92));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Maize (Corn)", 88));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Big Onion", 84));
            crops.add(new CropAdvisorResponseDTO.CropSuitability("Samba Rice / Paddy", 80));
            costPerAcre = new BigDecimal("120000");
            yieldMinKg = new BigDecimal("3200");
            yieldMaxKg = new BigDecimal("4500");
            pricePerKg = new BigDecimal("520");
            riskLevel = "Moderate";
        }

        // Adjust suitability based on Soil & Water
        if (water.toLowerCase().contains("rainfed") || water.toLowerCase().contains("low")) {
            riskLevel = "High (Rainfed Moisture Vulnerability)";
        }

        // Scale economic estimates dynamically by Land Size (Acres)
        BigDecimal landFactor = BigDecimal.valueOf(acres);
        BigDecimal estimatedCost = costPerAcre.multiply(landFactor).setScale(2, RoundingMode.HALF_UP);
        BigDecimal minRevenue = yieldMinKg.multiply(landFactor).multiply(pricePerKg).setScale(2, RoundingMode.HALF_UP);
        BigDecimal maxRevenue = yieldMaxKg.multiply(landFactor).multiply(pricePerKg).setScale(2, RoundingMode.HALF_UP);

        return new CropAdvisorResponseDTO(
            bestRecommendation + " (" + location + " Matrix)",
            harvestPeriod,
            estimatedCost,
            minRevenue,
            maxRevenue,
            riskLevel,
            crops
        );
    }
}
