package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.util.List;

public final class PricePredictionResponseDTO {

    private final String cropName;
    private final BigDecimal todaysMarketPriceLkr;
    private final BigDecimal predictedFairPriceLkr;
    private final double sevenDayChangePercentage;
    private final String recommendation;
    private final String bestActionWindow;
    private final List<Double> historicalPrices;
    private final List<Double> forecastPrices;
    private final List<FactorImpact> factorBreakdown;

    public PricePredictionResponseDTO(String cropName,
                                      BigDecimal todaysMarketPriceLkr,
                                      BigDecimal predictedFairPriceLkr,
                                      double sevenDayChangePercentage,
                                      String recommendation,
                                      String bestActionWindow,
                                      List<Double> historicalPrices,
                                      List<Double> forecastPrices,
                                      List<FactorImpact> factorBreakdown) {
        this.cropName = cropName;
        this.todaysMarketPriceLkr = todaysMarketPriceLkr;
        this.predictedFairPriceLkr = predictedFairPriceLkr;
        this.sevenDayChangePercentage = sevenDayChangePercentage;
        this.recommendation = recommendation;
        this.bestActionWindow = bestActionWindow;
        this.historicalPrices = historicalPrices != null ? List.copyOf(historicalPrices) : List.of();
        this.forecastPrices = forecastPrices != null ? List.copyOf(forecastPrices) : List.of();
        this.factorBreakdown = factorBreakdown != null ? List.copyOf(factorBreakdown) : List.of();
    }

    public String getCropName() { return cropName; }
    public BigDecimal getTodaysMarketPriceLkr() { return todaysMarketPriceLkr; }
    public BigDecimal getPredictedFairPriceLkr() { return predictedFairPriceLkr; }
    public double getSevenDayChangePercentage() { return sevenDayChangePercentage; }
    public String getRecommendation() { return recommendation; }
    public String getBestActionWindow() { return bestActionWindow; }
    public List<Double> getHistoricalPrices() { return historicalPrices; }
    public List<Double> getForecastPrices() { return forecastPrices; }
    public List<FactorImpact> getFactorBreakdown() { return factorBreakdown; }

    public static final class FactorImpact {
        private final String factorName;
        private final String impactText;
        private final boolean positive;

        public FactorImpact(String factorName, String impactText, boolean positive) {
            this.factorName = factorName;
            this.impactText = impactText;
            this.positive = positive;
        }

        public String getFactorName() { return factorName; }
        public String getImpactText() { return impactText; }
        public boolean isPositive() { return positive; }
    }
}
