package com.example.agrolink.service;

import java.math.BigDecimal;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.agrolink.dto.GovIntelligenceDTO;
import com.example.agrolink.dto.GovIntelligenceDTO.*;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;

@Service
public class GovIntelligenceService {

    private static final Logger logger = LoggerFactory.getLogger(GovIntelligenceService.class);

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;

    public GovIntelligenceService(UserRepository userRepository,
                                  CropRepository cropRepository,
                                  OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
    }

    public GovIntelligenceDTO getNationalAgriculturalOverview() {
        logger.info("Generating Sri Lanka National Agricultural Overview & Policy Intelligence");

        // Base query counts from DB combined with national macro estimations
        long dbUsers = userRepository.count();
        long dbCrops = cropRepository.count();
        long dbOrders = orderRepository.count();

        long activeFarmers = 42811 + (dbUsers * 12);
        long activeBuyers = 8927 + (dbUsers * 3);
        long currentListings = 73114 + (dbCrops * 15);
        BigDecimal todayTransactions = BigDecimal.valueOf(38450000.00).add(BigDecimal.valueOf(dbOrders * 125000.0));

        OverviewStats overviewStats = new OverviewStats(
                activeFarmers,
                activeBuyers,
                currentListings,
                todayTransactions,
                14.2, // +14.2% MoM growth
                84.5  // Food Security Index rating
        );

        // Predictive Warning Alerts (as specified in prompt & national intelligence)
        List<PolicyAlert> policyAlerts = List.of(
                new PolicyAlert(
                        "ALT-01",
                        "Potato Shortage Predicted",
                        "SHORTAGE",
                        "CRITICAL",
                        "Nuwara Eliya / Badulla",
                        "Heavy blight and harvest delay in Nuwara Eliya expected to cause 24% deficit in potato market over next 3 weeks.",
                        "Consider temporary import tariff relaxation and release of islandwide buffer reserves."
                ),
                new PolicyAlert(
                        "ALT-02",
                        "Tomato Oversupply Detected",
                        "OVERSUPPLY",
                        "WARNING",
                        "Dambulla & Matale",
                        "Bumper harvest in Matale district entering Dambulla Hub exceeds regional demand by 38%, depressing farmer spot prices.",
                        "Initiate post-harvest processing grants and route excess supply to processing centers in Southern Province."
                ),
                new PolicyAlert(
                        "ALT-03",
                        "Heavy Rainfall Risk – Central Province",
                        "WEATHER",
                        "CRITICAL",
                        "Central & Sabaragamuwa",
                        "Met Department predicts monsoonal deluge (>150mm) risking severe damage to vegetable plots and soil erosion.",
                        "Issue early flood advisories to vegetable growers; activate crop insurance emergency claim line."
                ),
                new PolicyAlert(
                        "ALT-04",
                        "Chili Leaf Curl Virus Outbreak",
                        "DISEASE",
                        "WARNING",
                        "Jaffna & Anuradhapura",
                        "Vector infestation reported across 420 hectares of green chili fields.",
                        "Deploy Agrarian Extension Officers with biological spray packages."
                ),
                new PolicyAlert(
                        "ALT-05",
                        "Dambulla Logistics Choke Point",
                        "SUPPLY_CHAIN",
                        "INFO",
                        "Dambulla Economic Center",
                        "High transit congestion causing average 4.2-hour unloading delay and 18% post-harvest perishable loss.",
                        "Implement time-slot dispatch system for heavy transport trucks."
                )
        );

        // District Crop Production Breakdown
        List<DistrictProduction> districtProductions = List.of(
                new DistrictProduction("Nuwara Eliya", "Central", 14250.0, "Potato & Carrot", 8920, "HIGH"),
                new DistrictProduction("Anuradhapura", "North Central", 48200.0, "Paddy (Rice) & Maize", 14200, "LOW"),
                new DistrictProduction("Polonnaruwa", "North Central", 41500.0, "Paddy (Rice)", 12450, "LOW"),
                new DistrictProduction("Badulla", "Uva", 18900.0, "Tea & Exotic Vegetables", 7800, "MODERATE"),
                new DistrictProduction("Jaffna", "Northern", 12400.0, "Red Onion & Chili", 5600, "MODERATE"),
                new DistrictProduction("Kurunegala", "North Western", 31200.0, "Coconut & Paddy", 11200, "LOW"),
                new DistrictProduction("Matale", "Central", 16800.0, "Spices & Tomato", 6400, "HIGH"),
                new DistrictProduction("Hambantota", "Southern", 22100.0, "Banana & Paddy", 7100, "LOW"),
                new DistrictProduction("Kandy", "Central", 11500.0, "Vegetables & Tea", 5900, "MODERATE"),
                new DistrictProduction("Gampaha", "Western", 9800.0, "Pineapple & Fruits", 4300, "LOW")
        );

        // Crop Demand vs Supply Balance
        List<CropDemandSupply> cropDemandSupplies = List.of(
                new CropDemandSupply("Paddy / Rice", 120000.0, 128000.0, "SURPLUS", 6.7),
                new CropDemandSupply("Potato", 45000.0, 34200.0, "DEFICIT", -24.0),
                new CropDemandSupply("Tomato", 22000.0, 30360.0, "SURPLUS", 38.0),
                new CropDemandSupply("Carrot", 18000.0, 16200.0, "DEFICIT", -10.0),
                new CropDemandSupply("Green Chili", 15000.0, 11850.0, "DEFICIT", -21.0),
                new CropDemandSupply("Big Onion", 38000.0, 28500.0, "DEFICIT", -25.0),
                new CropDemandSupply("Maize", 65000.0, 68900.0, "SURPLUS", 6.0),
                new CropDemandSupply("Coconut", 85000.0, 89250.0, "SURPLUS", 5.0)
        );

        // Market Price & Inflation Trends
        List<PriceMarketIndex> priceMarketIndices = List.of(
                new PriceMarketIndex("Potato (Local)", "Keppetipola", 280.00, 340.00, 12.5),
                new PriceMarketIndex("Tomato", "Dambulla", 85.00, 130.00, -22.4),
                new PriceMarketIndex("Samba Rice", "Pettah", 220.00, 245.00, 1.8),
                new PriceMarketIndex("Green Chili", "Meegoda", 420.00, 520.00, 18.2),
                new PriceMarketIndex("Big Onion", "Dambulla", 195.00, 240.00, 8.5),
                new PriceMarketIndex("Carrot", "Nuwara Eliya", 210.00, 270.00, 5.2)
        );

        // Disease Outbreak Monitoring
        List<DiseaseOutbreakLog> diseaseOutbreakLogs = List.of(
                new DiseaseOutbreakLog("Paddy Blast Disease", "Rice (Paddy)", "Polonnaruwa", 142, "HIGH", "MONITORING"),
                new DiseaseOutbreakLog("Chili Leaf Curl Virus", "Green Chili", "Jaffna", 98, "MEDIUM", "SPREADING"),
                new DiseaseOutbreakLog("Late Blight", "Potato", "Nuwara Eliya", 215, "HIGH", "MONITORING"),
                new DiseaseOutbreakLog("Coconut Caterpillar Infestation", "Coconut", "Kurunegala", 34, "LOW", "CONTAINED")
        );

        // Supply Chain Bottlenecks
        SupplyChainMetrics supplyChainMetrics = new SupplyChainMetrics(
                18.4, // % post-harvest loss national average
                62.5, // % cold chain utilization
                3.8,  // Average transit delay hours
                "Dambulla Central Distribution Hub & A9 Northern Arterial Highway"
        );

        return new GovIntelligenceDTO(
                overviewStats,
                policyAlerts,
                districtProductions,
                cropDemandSupplies,
                priceMarketIndices,
                diseaseOutbreakLogs,
                supplyChainMetrics
        );
    }

    public Map<String, Object> simulatePolicyImpact(double importTariffChangePct, double storageSubsidyLkrPerKg, double fertilizerSubsidyPct) {
        logger.info("Simulating Policy Impact: tariffChange={}%, storageSubsidy={}, fertilizerSubsidy={}%",
                importTariffChangePct, storageSubsidyLkrPerKg, fertilizerSubsidyPct);

        double expectedPriceChangePct = - (importTariffChangePct * 0.45) - (storageSubsidyLkrPerKg * 0.15) - (fertilizerSubsidyPct * 0.25);
        double supplyIncreasePct = (fertilizerSubsidyPct * 0.35) + (storageSubsidyLkrPerKg * 0.20);
        double foodSecurityScoreDelta = (supplyIncreasePct * 0.6) - (expectedPriceChangePct * 0.4);

        Map<String, Object> simulationResult = new LinkedHashMap<>();
        simulationResult.put("projectedPriceChangePct", Math.round(expectedPriceChangePct * 10.0) / 10.0);
        simulationResult.put("projectedNationalSupplyIncreasePct", Math.round(supplyIncreasePct * 10.0) / 10.0);
        simulationResult.put("foodSecurityScoreImpact", Math.round(foodSecurityScoreDelta * 10.0) / 10.0);
        simulationResult.put("policyRecommendation", expectedPriceChangePct < -5
                ? "HIGHLY EFFECTIVE: Reduces consumer inflation while boosting farmer productivity."
                : "MODERATE: Combine with localized storage incentives in Central Province.");

        return simulationResult;
    }
}
