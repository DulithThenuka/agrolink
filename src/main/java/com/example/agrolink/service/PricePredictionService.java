package com.example.agrolink.service;

import com.example.agrolink.dto.PricePredictionResponseDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PricePredictionService {

    public PricePredictionResponseDTO getPrediction(String cropName) {
        String name = (cropName != null && !cropName.isBlank()) ? cropName : "Tomato";

        BigDecimal todaysPrice = new BigDecimal("210.00");
        BigDecimal predictedFairPrice = new BigDecimal("225.00");
        double sevenDayChange = 8.0; // +8%
        String recommendation = "WAIT 3–4 DAYS BEFORE SELLING";
        String window = "Optimal Sell Window: Day 4 – Day 5";

        List<Double> historical = List.of(195.0, 198.0, 200.0, 204.0, 208.0, 210.0);
        List<Double> forecast = List.of(212.0, 216.0, 220.0, 225.0, 227.0, 226.0, 224.0);

        List<PricePredictionResponseDTO.FactorImpact> factors = new ArrayList<>();
        factors.add(new PricePredictionResponseDTO.FactorImpact("Weather Forecast", "+3.2% (Rainfall in Producing Belt)", true));
        factors.add(new PricePredictionResponseDTO.FactorImpact("Festival Demand Surge", "+4.8% (Upcoming Cultural Festival)", true));
        factors.add(new PricePredictionResponseDTO.FactorImpact("Regional Inventory", "-1.0% (Stable Wholesale Inflow)", false));

        return new PricePredictionResponseDTO(
            name,
            todaysPrice,
            predictedFairPrice,
            sevenDayChange,
            recommendation,
            window,
            historical,
            forecast,
            factors
        );
    }
}
