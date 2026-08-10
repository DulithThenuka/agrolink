package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.util.List;

public final class WasteReductionDTO {

    private final String cropName;
    private final int quantityKg;
    private final int daysToExpiry;
    private final String unsoldRiskLevel; // HIGH, MEDIUM, LOW
    private final double recommendedDiscountPct; // e.g. 15.0
    private final BigDecimal originalPricePerKg;
    private final BigDecimal discountedPricePerKg;
    private final List<CommercialBuyerMatch> nearbyCommercialBuyers;
    private final List<DonationPartnerMatch> donationPartners;
    private final List<ProcessingCompanyMatch> processingCompanies;
    private final EnvironmentalImpact environmentalImpact;

    public WasteReductionDTO(String cropName,
                               int quantityKg,
                               int daysToExpiry,
                               String unsoldRiskLevel,
                               double recommendedDiscountPct,
                               BigDecimal originalPricePerKg,
                               BigDecimal discountedPricePerKg,
                               List<CommercialBuyerMatch> nearbyCommercialBuyers,
                               List<DonationPartnerMatch> donationPartners,
                               List<ProcessingCompanyMatch> processingCompanies,
                               EnvironmentalImpact environmentalImpact) {
        this.cropName = cropName;
        this.quantityKg = quantityKg;
        this.daysToExpiry = daysToExpiry;
        this.unsoldRiskLevel = unsoldRiskLevel;
        this.recommendedDiscountPct = recommendedDiscountPct;
        this.originalPricePerKg = originalPricePerKg;
        this.discountedPricePerKg = discountedPricePerKg;
        this.nearbyCommercialBuyers = nearbyCommercialBuyers != null ? List.copyOf(nearbyCommercialBuyers) : List.of();
        this.donationPartners = donationPartners != null ? List.copyOf(donationPartners) : List.of();
        this.processingCompanies = processingCompanies != null ? List.copyOf(processingCompanies) : List.of();
        this.environmentalImpact = environmentalImpact;
    }

    public String getCropName() { return cropName; }
    public int getQuantityKg() { return quantityKg; }
    public int getDaysToExpiry() { return daysToExpiry; }
    public String getUnsoldRiskLevel() { return unsoldRiskLevel; }
    public double getRecommendedDiscountPct() { return recommendedDiscountPct; }
    public BigDecimal getOriginalPricePerKg() { return originalPricePerKg; }
    public BigDecimal getDiscountedPricePerKg() { return discountedPricePerKg; }
    public List<CommercialBuyerMatch> getNearbyCommercialBuyers() { return nearbyCommercialBuyers; }
    public List<DonationPartnerMatch> getDonationPartners() { return donationPartners; }
    public List<ProcessingCompanyMatch> getProcessingCompanies() { return processingCompanies; }
    public EnvironmentalImpact getEnvironmentalImpact() { return environmentalImpact; }

    // Nested Classes

    public static final class CommercialBuyerMatch {
        private final String name;
        private final String category; // Restaurant, Hotel, Supermarket
        private final double distanceKm;
        private final int requiredQuantityKg;
        private final String contactPhone;

        public CommercialBuyerMatch(String name, String category, double distanceKm, int requiredQuantityKg, String contactPhone) {
            this.name = name;
            this.category = category;
            this.distanceKm = distanceKm;
            this.requiredQuantityKg = requiredQuantityKg;
            this.contactPhone = contactPhone;
        }

        public String getName() { return name; }
        public String getCategory() { return category; }
        public double getDistanceKm() { return distanceKm; }
        public int getRequiredQuantityKg() { return requiredQuantityKg; }
        public String getContactPhone() { return contactPhone; }
    }

    public static final class DonationPartnerMatch {
        private final String name;
        private final String type; // Food Bank, Community Kitchen, Orphanage
        private final double distanceKm;
        private final boolean pickupAvailable;
        private final String taxDeductionEligible;

        public DonationPartnerMatch(String name, String type, double distanceKm, boolean pickupAvailable, String taxDeductionEligible) {
            this.name = name;
            this.type = type;
            this.distanceKm = distanceKm;
            this.pickupAvailable = pickupAvailable;
            this.taxDeductionEligible = taxDeductionEligible;
        }

        public String getName() { return name; }
        public String getType() { return type; }
        public double getDistanceKm() { return distanceKm; }
        public boolean isPickupAvailable() { return pickupAvailable; }
        public String getTaxDeductionEligible() { return taxDeductionEligible; }
    }

    public static final class ProcessingCompanyMatch {
        private final String name;
        private final String processingType; // Sauce Factory, Juice Plant, Dehydration Facility
        private final BigDecimal offeredPricePerKg;
        private final double distanceKm;
        private final String capacityStatus;

        public ProcessingCompanyMatch(String name, String processingType, BigDecimal offeredPricePerKg, double distanceKm, String capacityStatus) {
            this.name = name;
            this.processingType = processingType;
            this.offeredPricePerKg = offeredPricePerKg;
            this.distanceKm = distanceKm;
            this.capacityStatus = capacityStatus;
        }

        public String getName() { return name; }
        public String getProcessingType() { return processingType; }
        public BigDecimal getOfferedPricePerKg() { return offeredPricePerKg; }
        public double getDistanceKm() { return distanceKm; }
        public String getCapacityStatus() { return capacityStatus; }
    }

    public static final class EnvironmentalImpact {
        private final double co2SavedKg;
        private final double waterSavedLiters;
        private final int mealsCreated;

        public EnvironmentalImpact(double co2SavedKg, double waterSavedLiters, int mealsCreated) {
            this.co2SavedKg = co2SavedKg;
            this.waterSavedLiters = waterSavedLiters;
            this.mealsCreated = mealsCreated;
        }

        public double getCo2SavedKg() { return co2SavedKg; }
        public double getWaterSavedLiters() { return waterSavedLiters; }
        public int getMealsCreated() { return mealsCreated; }
    }
}
