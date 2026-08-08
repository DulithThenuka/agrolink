package com.example.agrolink.dto;

import java.util.List;

public final class DemandForecastDTO {

    private final String provinceName;
    private final String overallMarketBalance;
    private final String socialImpactNotice;
    private final List<CropDemandItem> cropDemands;

    public DemandForecastDTO(String provinceName,
                             String overallMarketBalance,
                             String socialImpactNotice,
                             List<CropDemandItem> cropDemands) {
        this.provinceName = provinceName;
        this.overallMarketBalance = overallMarketBalance;
        this.socialImpactNotice = socialImpactNotice;
        this.cropDemands = cropDemands != null ? List.copyOf(cropDemands) : List.of();
    }

    public String getProvinceName() { return provinceName; }
    public String getOverallMarketBalance() { return overallMarketBalance; }
    public String getSocialImpactNotice() { return socialImpactNotice; }
    public List<CropDemandItem> getCropDemands() { return cropDemands; }

    public static final class CropDemandItem {
        private final String cropName;
        private final String demandLevel;
        private final double surgePercentage;
        private final boolean positiveTrend;
        private final String riskStatus;

        public CropDemandItem(String cropName, String demandLevel, double surgePercentage, boolean positiveTrend, String riskStatus) {
            this.cropName = cropName;
            this.demandLevel = demandLevel;
            this.surgePercentage = surgePercentage;
            this.positiveTrend = positiveTrend;
            this.riskStatus = riskStatus;
        }

        public String getCropName() { return cropName; }
        public String getDemandLevel() { return demandLevel; }
        public double getSurgePercentage() { return surgePercentage; }
        public boolean isPositiveTrend() { return positiveTrend; }
        public String getRiskStatus() { return riskStatus; }
    }
}
