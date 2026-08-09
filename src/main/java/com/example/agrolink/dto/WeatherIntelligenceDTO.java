package com.example.agrolink.dto;

import java.util.List;

public final class WeatherIntelligenceDTO {

    private final String location;
    private final String alertTitle;
    private final String expectedTime;
    private final double rainfallMm;
    private final String riskLevel;
    private final List<String> affectedCrops;
    private final String recommendation;
    private final double temperatureC;
    private final String highLowTemp;
    private final double humidityPercent;
    private final double windKmh;
    private final String windDirection;
    private final String droughtAlert;
    private final String floodingRisk;
    private final String irrigationAdvice;
    private final List<DailyForecast> dailyForecasts;

    public WeatherIntelligenceDTO(String location,
                                  String alertTitle,
                                  String expectedTime,
                                  double rainfallMm,
                                  String riskLevel,
                                  List<String> affectedCrops,
                                  String recommendation,
                                  double temperatureC,
                                  String highLowTemp,
                                  double humidityPercent,
                                  double windKmh,
                                  String windDirection,
                                  String droughtAlert,
                                  String floodingRisk,
                                  String irrigationAdvice,
                                  List<DailyForecast> dailyForecasts) {
        this.location = location;
        this.alertTitle = alertTitle;
        this.expectedTime = expectedTime;
        this.rainfallMm = rainfallMm;
        this.riskLevel = riskLevel;
        this.affectedCrops = affectedCrops != null ? List.copyOf(affectedCrops) : List.of();
        this.recommendation = recommendation;
        this.temperatureC = temperatureC;
        this.highLowTemp = highLowTemp;
        this.humidityPercent = humidityPercent;
        this.windKmh = windKmh;
        this.windDirection = windDirection;
        this.droughtAlert = droughtAlert;
        this.floodingRisk = floodingRisk;
        this.irrigationAdvice = irrigationAdvice;
        this.dailyForecasts = dailyForecasts != null ? List.copyOf(dailyForecasts) : List.of();
    }

    public String getLocation() { return location; }
    public String getAlertTitle() { return alertTitle; }
    public String getExpectedTime() { return expectedTime; }
    public double getRainfallMm() { return rainfallMm; }
    public String getRiskLevel() { return riskLevel; }
    public List<String> getAffectedCrops() { return affectedCrops; }
    public String getRecommendation() { return recommendation; }
    public double getTemperatureC() { return temperatureC; }
    public String getHighLowTemp() { return highLowTemp; }
    public double getHumidityPercent() { return humidityPercent; }
    public double getWindKmh() { return windKmh; }
    public String getWindDirection() { return windDirection; }
    public String getDroughtAlert() { return droughtAlert; }
    public String getFloodingRisk() { return floodingRisk; }
    public String getIrrigationAdvice() { return irrigationAdvice; }
    public List<DailyForecast> getDailyForecasts() { return dailyForecasts; }

    public static final class DailyForecast {
        private final String dayName;
        private final String condition;
        private final double maxTempC;
        private final double minTempC;
        private final double rainfallMm;
        private final String riskLevel;

        public DailyForecast(String dayName, String condition, double maxTempC, double minTempC, double rainfallMm, String riskLevel) {
            this.dayName = dayName;
            this.condition = condition;
            this.maxTempC = maxTempC;
            this.minTempC = minTempC;
            this.rainfallMm = rainfallMm;
            this.riskLevel = riskLevel;
        }

        public String getDayName() { return dayName; }
        public String getCondition() { return condition; }
        public double getMaxTempC() { return maxTempC; }
        public double getMinTempC() { return minTempC; }
        public double getRainfallMm() { return rainfallMm; }
        public String getRiskLevel() { return riskLevel; }
    }
}
