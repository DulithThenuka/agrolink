package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.util.List;

public final class CropAdvisorResponseDTO {

    private final String bestRecommendation;
    private final String expectedHarvestingPeriod;
    private final BigDecimal estimatedCostLkr;
    private final BigDecimal minEstimatedRevenueLkr;
    private final BigDecimal maxEstimatedRevenueLkr;
    private final String riskLevel;
    private final List<CropSuitability> recommendedCrops;

    public CropAdvisorResponseDTO(String bestRecommendation,
                                 String expectedHarvestingPeriod,
                                 BigDecimal estimatedCostLkr,
                                 BigDecimal minEstimatedRevenueLkr,
                                 BigDecimal maxEstimatedRevenueLkr,
                                 String riskLevel,
                                 List<CropSuitability> recommendedCrops) {
        this.bestRecommendation = bestRecommendation;
        this.expectedHarvestingPeriod = expectedHarvestingPeriod;
        this.estimatedCostLkr = estimatedCostLkr;
        this.minEstimatedRevenueLkr = minEstimatedRevenueLkr;
        this.maxEstimatedRevenueLkr = maxEstimatedRevenueLkr;
        this.riskLevel = riskLevel;
        this.recommendedCrops = recommendedCrops != null ? List.copyOf(recommendedCrops) : List.of();
    }

    public String getBestRecommendation() { return bestRecommendation; }
    public String getExpectedHarvestingPeriod() { return expectedHarvestingPeriod; }
    public BigDecimal getEstimatedCostLkr() { return estimatedCostLkr; }
    public BigDecimal getMinEstimatedRevenueLkr() { return minEstimatedRevenueLkr; }
    public BigDecimal getMaxEstimatedRevenueLkr() { return maxEstimatedRevenueLkr; }
    public String getRiskLevel() { return riskLevel; }
    public List<CropSuitability> getRecommendedCrops() { return recommendedCrops; }

    public static final class CropSuitability {
        private final String cropName;
        private final int suitabilityPercentage;

        public CropSuitability(String cropName, int suitabilityPercentage) {
            this.cropName = cropName;
            this.suitabilityPercentage = suitabilityPercentage;
        }

        public String getCropName() { return cropName; }
        public int getSuitabilityPercentage() { return suitabilityPercentage; }
    }
}
