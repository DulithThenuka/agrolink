package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.util.List;

public final class FarmerDashboardDTO {

    private final String farmerName;
    private final int farmHealthPercentage;
    private final long currentCropsCount;
    private final BigDecimal expectedRevenueLkr;
    private final long pendingOrdersCount;
    private final String weatherRisk;
    private final String diseaseRisk;
    private final String marketDemand;
    private final List<LowStockAlert> lowStockAlerts;
    private final List<CropBenchmark> cropBenchmarks;
    private final List<OrderSummaryDTO> recentFarmerOrders;

    public FarmerDashboardDTO(String farmerName,
                              int farmHealthPercentage,
                              long currentCropsCount,
                              BigDecimal expectedRevenueLkr,
                              long pendingOrdersCount,
                              String weatherRisk,
                              String diseaseRisk,
                              String marketDemand,
                              List<LowStockAlert> lowStockAlerts,
                              List<CropBenchmark> cropBenchmarks,
                              List<OrderSummaryDTO> recentFarmerOrders) {
        this.farmerName = farmerName;
        this.farmHealthPercentage = farmHealthPercentage;
        this.currentCropsCount = currentCropsCount;
        this.expectedRevenueLkr = expectedRevenueLkr != null ? expectedRevenueLkr : BigDecimal.ZERO;
        this.pendingOrdersCount = pendingOrdersCount;
        this.weatherRisk = weatherRisk;
        this.diseaseRisk = diseaseRisk;
        this.marketDemand = marketDemand;
        this.lowStockAlerts = lowStockAlerts != null ? List.copyOf(lowStockAlerts) : List.of();
        this.cropBenchmarks = cropBenchmarks != null ? List.copyOf(cropBenchmarks) : List.of();
        this.recentFarmerOrders = recentFarmerOrders != null ? List.copyOf(recentFarmerOrders) : List.of();
    }

    public String getFarmerName() { return farmerName; }
    public int getFarmHealthPercentage() { return farmHealthPercentage; }
    public long getCurrentCropsCount() { return currentCropsCount; }
    public BigDecimal getExpectedRevenueLkr() { return expectedRevenueLkr; }
    public long getPendingOrdersCount() { return pendingOrdersCount; }
    public String getWeatherRisk() { return weatherRisk; }
    public String getDiseaseRisk() { return diseaseRisk; }
    public String getMarketDemand() { return marketDemand; }
    public List<LowStockAlert> getLowStockAlerts() { return lowStockAlerts; }
    public List<CropBenchmark> getCropBenchmarks() { return cropBenchmarks; }
    public List<OrderSummaryDTO> getRecentFarmerOrders() { return recentFarmerOrders; }

    public static final class LowStockAlert {
        private final String cropName;
        private final int remainingQuantity;

        public LowStockAlert(String cropName, int remainingQuantity) {
            this.cropName = cropName;
            this.remainingQuantity = remainingQuantity;
        }

        public String getCropName() { return cropName; }
        public int getRemainingQuantity() { return remainingQuantity; }
    }

    public static final class CropBenchmark {
        private final String cropName;
        private final double currentPrice;
        private final double recommendedPrice;
        private final String demandLevel;

        public CropBenchmark(String cropName, double currentPrice, double recommendedPrice, String demandLevel) {
            this.cropName = cropName;
            this.currentPrice = currentPrice;
            this.recommendedPrice = recommendedPrice;
            this.demandLevel = demandLevel;
        }

        public String getCropName() { return cropName; }
        public double getCurrentPrice() { return currentPrice; }
        public double getRecommendedPrice() { return recommendedPrice; }
        public String getDemandLevel() { return demandLevel; }
    }
}
