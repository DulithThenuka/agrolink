package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.util.List;

public final class PricePredictionResponseDTO {

    private final String cropName;
    private final String location;
    private final String selectedGrade;
    private final BigDecimal todaysMarketPriceLkr;
    private final BigDecimal predictedFairPriceLkr;
    private final BigDecimal gradeAPriceLkr;
    private final BigDecimal gradeBPriceLkr;
    private final BigDecimal gradeCPriceLkr;
    private final double sevenDayChangePercentage;
    private final String recommendation;
    private final String bestActionWindow;
    private final List<Double> historicalPrices;
    private final List<Double> forecastPrices;
    private final List<FactorImpact> factorBreakdown;

    public PricePredictionResponseDTO(String cropName,
                                      String location,
                                      String selectedGrade,
                                      BigDecimal todaysMarketPriceLkr,
                                      BigDecimal predictedFairPriceLkr,
                                      BigDecimal gradeAPriceLkr,
                                      BigDecimal gradeBPriceLkr,
                                      BigDecimal gradeCPriceLkr,
                                      double sevenDayChangePercentage,
                                      String recommendation,
                                      String bestActionWindow,
                                      List<Double> historicalPrices,
                                      List<Double> forecastPrices,
                                      List<FactorImpact> factorBreakdown) {
        this.cropName = cropName;
        this.location = location;
        this.selectedGrade = selectedGrade;
        this.todaysMarketPriceLkr = todaysMarketPriceLkr;
        this.predictedFairPriceLkr = predictedFairPriceLkr;
        this.gradeAPriceLkr = gradeAPriceLkr;
        this.gradeBPriceLkr = gradeBPriceLkr;
        this.gradeCPriceLkr = gradeCPriceLkr;
        this.sevenDayChangePercentage = sevenDayChangePercentage;
        this.recommendation = recommendation;
        this.bestActionWindow = bestActionWindow;
        this.historicalPrices = historicalPrices != null ? List.copyOf(historicalPrices) : List.of();
        this.forecastPrices = forecastPrices != null ? List.copyOf(forecastPrices) : List.of();
        this.factorBreakdown = factorBreakdown != null ? List.copyOf(factorBreakdown) : List.of();
    }

    // Overloaded constructor for backwards compatibility
    public PricePredictionResponseDTO(String cropName,
                                      BigDecimal todaysMarketPriceLkr,
                                      BigDecimal predictedFairPriceLkr,
                                      double sevenDayChangePercentage,
                                      String recommendation,
                                      String bestActionWindow,
                                      List<Double> historicalPrices,
                                      List<Double> forecastPrices,
                                      List<FactorImpact> factorBreakdown) {
        this(cropName, "Dambulla", "Grade B", todaysMarketPriceLkr, predictedFairPriceLkr,
             predictedFairPriceLkr.multiply(new BigDecimal("1.22")),
             predictedFairPriceLkr,
             predictedFairPriceLkr.multiply(new BigDecimal("0.82")),
             sevenDayChangePercentage, recommendation, bestActionWindow, historicalPrices, forecastPrices, factorBreakdown);
    }

    public String getCropName() { return cropName; }
    public String getLocation() { return location; }
    public String getSelectedGrade() { return selectedGrade; }
    public BigDecimal getTodaysMarketPriceLkr() { return todaysMarketPriceLkr; }
    public BigDecimal getPredictedFairPriceLkr() { return predictedFairPriceLkr; }
    public BigDecimal getGradeAPriceLkr() { return gradeAPriceLkr; }
    public BigDecimal getGradeBPriceLkr() { return gradeBPriceLkr; }
    public BigDecimal getGradeCPriceLkr() { return gradeCPriceLkr; }
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
