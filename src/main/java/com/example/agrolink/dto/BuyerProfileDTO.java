package com.example.agrolink.dto;

public final class BuyerProfileDTO {

    private final Long id;
    private final String name;
    private final String email;
    private final boolean isVerifiedBuyer;
    private final String location;
    private final int memberSinceYear;
    private final int completedOrdersCount;
    private final double orderCancellationRate;
    private final double onTimePaymentRate;
    private final double buyerTrustScore;
    private final double farmerSatisfactionRate;

    public BuyerProfileDTO(Long id,
                           String name,
                           String email,
                           boolean isVerifiedBuyer,
                           String location,
                           int memberSinceYear,
                           int completedOrdersCount,
                           double orderCancellationRate,
                           double onTimePaymentRate,
                           double buyerTrustScore,
                           double farmerSatisfactionRate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isVerifiedBuyer = isVerifiedBuyer;
        this.location = location;
        this.memberSinceYear = memberSinceYear;
        this.completedOrdersCount = completedOrdersCount;
        this.orderCancellationRate = orderCancellationRate;
        this.onTimePaymentRate = onTimePaymentRate;
        this.buyerTrustScore = buyerTrustScore;
        this.farmerSatisfactionRate = farmerSatisfactionRate;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isVerifiedBuyer() { return isVerifiedBuyer; }
    public String getLocation() { return location; }
    public int getMemberSinceYear() { return memberSinceYear; }
    public int getCompletedOrdersCount() { return completedOrdersCount; }
    public double getOrderCancellationRate() { return orderCancellationRate; }
    public double getOnTimePaymentRate() { return onTimePaymentRate; }
    public double getBuyerTrustScore() { return buyerTrustScore; }
    public double getFarmerSatisfactionRate() { return farmerSatisfactionRate; }
}
