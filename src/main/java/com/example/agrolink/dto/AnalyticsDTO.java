package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.util.Map;
import java.util.List;

public final class AnalyticsDTO {

    private final BigDecimal totalTradeVolume;
    private final long totalListings;
    private final long totalCompletedOrders;
    private final double averageSavingsPercentage;
    private final Map<String, Double> categoryDistribution;
    private final List<CommodityPrice> commodityPrices;

    public AnalyticsDTO(BigDecimal totalTradeVolume,
                        long totalListings,
                        long totalCompletedOrders,
                        double averageSavingsPercentage,
                        Map<String, Double> categoryDistribution,
                        List<CommodityPrice> commodityPrices) {
        this.totalTradeVolume = totalTradeVolume != null ? totalTradeVolume : BigDecimal.ZERO;
        this.totalListings = totalListings;
        this.totalCompletedOrders = totalCompletedOrders;
        this.averageSavingsPercentage = averageSavingsPercentage;
        this.categoryDistribution = categoryDistribution != null ? categoryDistribution : Map.of();
        this.commodityPrices = commodityPrices != null ? List.copyOf(commodityPrices) : List.of();
    }

    public BigDecimal getTotalTradeVolume() { return totalTradeVolume; }
    public long getTotalListings() { return totalListings; }
    public long getTotalCompletedOrders() { return totalCompletedOrders; }
    public double getAverageSavingsPercentage() { return averageSavingsPercentage; }
    public Map<String, Double> getCategoryDistribution() { return categoryDistribution; }
    public List<CommodityPrice> getCommodityPrices() { return commodityPrices; }

    public static final class CommodityPrice {
        private final String name;
        private final double pricePerKg;
        private final double changePercentage;
        private final String trend;

        public CommodityPrice(String name, double pricePerKg, double changePercentage, String trend) {
            this.name = name;
            this.pricePerKg = pricePerKg;
            this.changePercentage = changePercentage;
            this.trend = trend;
        }

        public String getName() { return name; }
        public double getPricePerKg() { return pricePerKg; }
        public double getChangePercentage() { return changePercentage; }
        public String getTrend() { return trend; }
    }
}
