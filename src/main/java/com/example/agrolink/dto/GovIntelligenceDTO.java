package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public final class GovIntelligenceDTO {

    private final OverviewStats overviewStats;
    private final List<PolicyAlert> policyAlerts;
    private final List<DistrictProduction> districtProductions;
    private final List<CropDemandSupply> cropDemandSupplies;
    private final List<PriceMarketIndex> priceMarketIndices;
    private final List<DiseaseOutbreakLog> diseaseOutbreakLogs;
    private final SupplyChainMetrics supplyChainMetrics;

    public GovIntelligenceDTO(OverviewStats overviewStats,
                              List<PolicyAlert> policyAlerts,
                              List<DistrictProduction> districtProductions,
                              List<CropDemandSupply> cropDemandSupplies,
                              List<PriceMarketIndex> priceMarketIndices,
                              List<DiseaseOutbreakLog> diseaseOutbreakLogs,
                              SupplyChainMetrics supplyChainMetrics) {
        this.overviewStats = overviewStats;
        this.policyAlerts = policyAlerts != null ? List.copyOf(policyAlerts) : List.of();
        this.districtProductions = districtProductions != null ? List.copyOf(districtProductions) : List.of();
        this.cropDemandSupplies = cropDemandSupplies != null ? List.copyOf(cropDemandSupplies) : List.of();
        this.priceMarketIndices = priceMarketIndices != null ? List.copyOf(priceMarketIndices) : List.of();
        this.diseaseOutbreakLogs = diseaseOutbreakLogs != null ? List.copyOf(diseaseOutbreakLogs) : List.of();
        this.supplyChainMetrics = supplyChainMetrics;
    }

    public OverviewStats getOverviewStats() { return overviewStats; }
    public List<PolicyAlert> getPolicyAlerts() { return policyAlerts; }
    public List<DistrictProduction> getDistrictProductions() { return districtProductions; }
    public List<CropDemandSupply> getCropDemandSupplies() { return cropDemandSupplies; }
    public List<PriceMarketIndex> getPriceMarketIndices() { return priceMarketIndices; }
    public List<DiseaseOutbreakLog> getDiseaseOutbreakLogs() { return diseaseOutbreakLogs; }
    public SupplyChainMetrics getSupplyChainMetrics() { return supplyChainMetrics; }

    // Nested Data Structures

    public static final class OverviewStats {
        private final long activeFarmers;
        private final long activeBuyers;
        private final long currentListings;
        private final BigDecimal todayTransactionLkr;
        private final double monthlyGrowthRate;
        private final double nationalFoodSecurityIndex; // e.g. 84.5 out of 100

        public OverviewStats(long activeFarmers, long activeBuyers, long currentListings,
                             BigDecimal todayTransactionLkr, double monthlyGrowthRate,
                             double nationalFoodSecurityIndex) {
            this.activeFarmers = activeFarmers;
            this.activeBuyers = activeBuyers;
            this.currentListings = currentListings;
            this.todayTransactionLkr = todayTransactionLkr != null ? todayTransactionLkr : BigDecimal.ZERO;
            this.monthlyGrowthRate = monthlyGrowthRate;
            this.nationalFoodSecurityIndex = nationalFoodSecurityIndex;
        }

        public long getActiveFarmers() { return activeFarmers; }
        public long getActiveBuyers() { return activeBuyers; }
        public long getCurrentListings() { return currentListings; }
        public BigDecimal getTodayTransactionLkr() { return todayTransactionLkr; }
        public double getMonthlyGrowthRate() { return monthlyGrowthRate; }
        public double getNationalFoodSecurityIndex() { return nationalFoodSecurityIndex; }
    }

    public static final class PolicyAlert {
        private final String id;
        private final String title;
        private final String category; // SHORTAGE, OVERSUPPLY, WEATHER, DISEASE, SUPPLY_CHAIN
        private final String severity; // CRITICAL, WARNING, INFO
        private final String region;
        private final String details;
        private final String recommendedAction;

        public PolicyAlert(String id, String title, String category, String severity, String region, String details, String recommendedAction) {
            this.id = id;
            this.title = title;
            this.category = category;
            this.severity = severity;
            this.region = region;
            this.details = details;
            this.recommendedAction = recommendedAction;
        }

        public String getId() { return id; }
        public String getTitle() { return title; }
        public String getCategory() { return category; }
        public String getSeverity() { return severity; }
        public String getRegion() { return region; }
        public String getDetails() { return details; }
        public String getRecommendedAction() { return recommendedAction; }
    }

    public static final class DistrictProduction {
        private final String district;
        private final String province;
        private final double cropYieldTons;
        private final String primaryCrop;
        private final long activeFarmers;
        private final String riskStatus; // LOW, MODERATE, HIGH

        public DistrictProduction(String district, String province, double cropYieldTons, String primaryCrop, long activeFarmers, String riskStatus) {
            this.district = district;
            this.province = province;
            this.cropYieldTons = cropYieldTons;
            this.primaryCrop = primaryCrop;
            this.activeFarmers = activeFarmers;
            this.riskStatus = riskStatus;
        }

        public String getDistrict() { return district; }
        public String getProvince() { return province; }
        public double getCropYieldTons() { return cropYieldTons; }
        public String getPrimaryCrop() { return primaryCrop; }
        public long getActiveFarmers() { return activeFarmers; }
        public String getRiskStatus() { return riskStatus; }
    }

    public static final class CropDemandSupply {
        private final String cropName;
        private final double demandTons;
        private final double supplyTons;
        private final String balanceStatus; // SURPLUS, DEFICIT, BALANCED
        private final double gapPercentage;

        public CropDemandSupply(String cropName, double demandTons, double supplyTons, String balanceStatus, double gapPercentage) {
            this.cropName = cropName;
            this.demandTons = demandTons;
            this.supplyTons = supplyTons;
            this.balanceStatus = balanceStatus;
            this.gapPercentage = gapPercentage;
        }

        public String getCropName() { return cropName; }
        public double getDemandTons() { return demandTons; }
        public double getSupplyTons() { return supplyTons; }
        public String getBalanceStatus() { return balanceStatus; }
        public double getGapPercentage() { return gapPercentage; }
    }

    public static final class PriceMarketIndex {
        private final String cropName;
        private final String centralMarket; // Dambulla, Pettah, Keppetipola, Meegoda
        private final double avgWholesalePriceRs;
        private final double avgRetailPriceRs;
        private final double weeklyPriceChangePct;

        public PriceMarketIndex(String cropName, String centralMarket, double avgWholesalePriceRs, double avgRetailPriceRs, double weeklyPriceChangePct) {
            this.cropName = cropName;
            this.centralMarket = centralMarket;
            this.avgWholesalePriceRs = avgWholesalePriceRs;
            this.avgRetailPriceRs = avgRetailPriceRs;
            this.weeklyPriceChangePct = weeklyPriceChangePct;
        }

        public String getCropName() { return cropName; }
        public String getCentralMarket() { return centralMarket; }
        public double getAvgWholesalePriceRs() { return avgWholesalePriceRs; }
        public double getAvgRetailPriceRs() { return avgRetailPriceRs; }
        public double getWeeklyPriceChangePct() { return weeklyPriceChangePct; }
    }

    public static final class DiseaseOutbreakLog {
        private final String diseaseName;
        private final String cropAffected;
        private final String locationDistrict;
        private final int reportedCases;
        private final String severity; // HIGH, MEDIUM, LOW
        private final String status; // CONTAINED, MONITORING, SPREADING

        public DiseaseOutbreakLog(String diseaseName, String cropAffected, String locationDistrict, int reportedCases, String severity, String status) {
            this.diseaseName = diseaseName;
            this.cropAffected = cropAffected;
            this.locationDistrict = locationDistrict;
            this.reportedCases = reportedCases;
            this.severity = severity;
            this.status = status;
        }

        public String getDiseaseName() { return diseaseName; }
        public String getCropAffected() { return cropAffected; }
        public String getLocationDistrict() { return locationDistrict; }
        public int getReportedCases() { return reportedCases; }
        public String getSeverity() { return severity; }
        public String getStatus() { return status; }
    }

    public static final class SupplyChainMetrics {
        private final double postHarvestLossPercentage;
        private final double coldChainStorageUtilizationPct;
        private final double avgTransitDelayHours;
        private final String keyChokePoint;

        public SupplyChainMetrics(double postHarvestLossPercentage, double coldChainStorageUtilizationPct, double avgTransitDelayHours, String keyChokePoint) {
            this.postHarvestLossPercentage = postHarvestLossPercentage;
            this.coldChainStorageUtilizationPct = coldChainStorageUtilizationPct;
            this.avgTransitDelayHours = avgTransitDelayHours;
            this.keyChokePoint = keyChokePoint;
        }

        public double getPostHarvestLossPercentage() { return postHarvestLossPercentage; }
        public double getColdChainStorageUtilizationPct() { return coldChainStorageUtilizationPct; }
        public double getAvgTransitDelayHours() { return avgTransitDelayHours; }
        public String getKeyChokePoint() { return keyChokePoint; }
    }
}
