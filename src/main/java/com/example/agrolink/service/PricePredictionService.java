package com.example.agrolink.service;

import com.example.agrolink.dto.PricePredictionResponseDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class PricePredictionService {

    public PricePredictionResponseDTO getPrediction(String cropName) {
        String name = (cropName != null && !cropName.isBlank()) ? cropName.trim() : "Tomato";
        String cropLower = name.toLowerCase();

        double today;
        double predicted;
        double changePct;
        String recommendation;
        String window;
        List<Double> historical = new ArrayList<>();
        List<Double> forecast = new ArrayList<>();
        List<PricePredictionResponseDTO.FactorImpact> factors = new ArrayList<>();

        if (cropLower.contains("chili")) {
            today = 520.0;
            predicted = 580.0;
            changePct = 11.5;
            recommendation = "HOLD HARVEST 5–7 DAYS (Dambulla Supply Deficit)";
            window = "Optimal Sell Window: Day 5 – Day 7";
            historical = List.of(460.0, 475.0, 490.0, 505.0, 515.0, 520.0);
            forecast = List.of(530.0, 545.0, 560.0, 580.0, 585.0, 575.0, 565.0);
            factors.add(new PricePredictionResponseDTO.FactorImpact("Rainfall in Dry Zone Belt", "+6.4% (Intermittent picking delays)", true));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Import Tariff Revision", "+4.1% (Increased duty on imported dry chili)", true));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Wholesale Inflow", "+1.0% (Stable demand from Manning Market)", true));
        } else if (cropLower.contains("potato")) {
            today = 290.0;
            predicted = 310.0;
            changePct = 6.9;
            recommendation = "SELL 50% NOW, HOLD REMAINDER 3 DAYS";
            window = "Optimal Sell Window: Day 3 – Day 4";
            historical = List.of(270.0, 275.0, 280.0, 285.0, 288.0, 290.0);
            forecast = List.of(294.0, 298.0, 305.0, 310.0, 308.0, 302.0, 298.0);
            factors.add(new PricePredictionResponseDTO.FactorImpact("Upcountry Storage Capacity", "+3.5% (High cold storage utilization)", true));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Pettah Market Inflow", "+2.4% (Strong institutional buyer orders)", true));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Fuel Logistics Cost", "+1.0% (Freight adjustment)", true));
        } else if (cropLower.contains("onion")) {
            today = 380.0;
            predicted = 360.0;
            changePct = -5.2;
            recommendation = "SELL IMMEDIATELY (Incoming Import Vessel Clearing)";
            window = "Optimal Sell Window: Today – Day 2";
            historical = List.of(410.0, 405.0, 398.0, 390.0, 384.0, 380.0);
            forecast = List.of(375.0, 370.0, 365.0, 360.0, 358.0, 362.0, 365.0);
            factors.add(new PricePredictionResponseDTO.FactorImpact("Import Supply Inflow", "-7.0% (5,000 MT import shipment arrival)", false));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Local Harvest Inflow", "-2.2% (Jaffna harvest release)", false));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Retail Consumption", "+4.0% (Steady household baseline)", true));
        } else if (cropLower.contains("rice") || cropLower.contains("paddy") || cropLower.contains("samba")) {
            today = 230.0;
            predicted = 238.0;
            changePct = 3.5;
            recommendation = "STABLE MARKET (Hold for Guaranteed Minimum Purchasing Price)";
            window = "Optimal Sell Window: Day 7 – Day 10";
            historical = List.of(222.0, 224.0, 225.0, 227.0, 229.0, 230.0);
            forecast = List.of(231.0, 233.0, 235.0, 238.0, 238.0, 237.0, 236.0);
            factors.add(new PricePredictionResponseDTO.FactorImpact("Paddy Marketing Board Stock", "+2.0% (Buffer stock maintenance)", true));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Mill Processing Inflow", "+1.5% (Steady private mill demand)", true));
        } else {
            // Default / Tomato / General Vegetables
            today = 180.0;
            predicted = 215.0;
            changePct = 19.4;
            recommendation = "WAIT 3–4 DAYS BEFORE SELLING (Post-Rain Quality Price Surge)";
            window = "Optimal Sell Window: Day 3 – Day 5";
            historical = List.of(150.0, 158.0, 164.0, 170.0, 176.0, 180.0);
            forecast = List.of(188.0, 196.0, 206.0, 215.0, 212.0, 205.0, 198.0);
            factors.add(new PricePredictionResponseDTO.FactorImpact("Central Belt Weather", "+8.5% (Excess rain in Welimada reduced picking)", true));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Economic Center Inflow", "+7.2% (Dambulla arrivals down 20%)", true));
            factors.add(new PricePredictionResponseDTO.FactorImpact("Urban Supermarket Demand", "+3.7% (High demand for Grade A produce)", true));
        }

        BigDecimal todaysPrice = BigDecimal.valueOf(today).setScale(2, RoundingMode.HALF_UP);
        BigDecimal predictedFairPrice = BigDecimal.valueOf(predicted).setScale(2, RoundingMode.HALF_UP);

        return new PricePredictionResponseDTO(
            name,
            todaysPrice,
            predictedFairPrice,
            changePct,
            recommendation,
            window,
            historical,
            forecast,
            factors
        );
    }
}
