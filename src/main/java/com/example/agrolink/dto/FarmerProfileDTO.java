package com.example.agrolink.dto;

import java.time.LocalDateTime;
import java.util.List;

public final class FarmerProfileDTO {

    private final Long id;
    private final String name;
    private final String email;
    private final boolean isVerified;
    private final String district;
    private final int memberSinceYear;
    private final int completedOrdersCount;
    private final double overallRating;
    private final double onTimeDeliveryRate;
    private final double productQualityRating;
    private final double buyerSatisfactionRate;
    private final int activeCropsCount;
    private final List<CropDTO> crops;

    public FarmerProfileDTO(Long id,
                            String name,
                            String email,
                            boolean isVerified,
                            String district,
                            int memberSinceYear,
                            int completedOrdersCount,
                            double overallRating,
                            double onTimeDeliveryRate,
                            double productQualityRating,
                            double buyerSatisfactionRate,
                            int activeCropsCount,
                            List<CropDTO> crops) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isVerified = isVerified;
        this.district = district;
        this.memberSinceYear = memberSinceYear;
        this.completedOrdersCount = completedOrdersCount;
        this.overallRating = overallRating;
        this.onTimeDeliveryRate = onTimeDeliveryRate;
        this.productQualityRating = productQualityRating;
        this.buyerSatisfactionRate = buyerSatisfactionRate;
        this.activeCropsCount = activeCropsCount;
        this.crops = crops;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isVerified() { return isVerified; }
    public String getDistrict() { return district; }
    public int getMemberSinceYear() { return memberSinceYear; }
    public int getCompletedOrdersCount() { return completedOrdersCount; }
    public double getOverallRating() { return overallRating; }
    public double getOnTimeDeliveryRate() { return onTimeDeliveryRate; }
    public double getProductQualityRating() { return productQualityRating; }
    public double getBuyerSatisfactionRate() { return buyerSatisfactionRate; }
    public int getActiveCropsCount() { return activeCropsCount; }
    public List<CropDTO> getCrops() { return crops; }
}
