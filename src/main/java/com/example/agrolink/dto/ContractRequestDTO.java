package com.example.agrolink.dto;

import java.math.BigDecimal;

public final class ContractRequestDTO {

    private final String id;
    private final String buyerName;
    private final String buyerCategory; // Supermarket, Hotel, Exporter
    private final String cropName;
    private final int monthlyQuantityKg;
    private final int durationMonths;
    private final BigDecimal minPriceLkr;
    private final BigDecimal maxPriceLkr;
    private final String qualityGrade;
    private final String deliveryFrequency;
    private final String status; // OPEN, FULFILLED
    private final int applicantCount;

    public ContractRequestDTO(String id,
                              String buyerName,
                              String buyerCategory,
                              String cropName,
                              int monthlyQuantityKg,
                              int durationMonths,
                              BigDecimal minPriceLkr,
                              BigDecimal maxPriceLkr,
                              String qualityGrade,
                              String deliveryFrequency,
                              String status,
                              int applicantCount) {
        this.id = id;
        this.buyerName = buyerName;
        this.buyerCategory = buyerCategory;
        this.cropName = cropName;
        this.monthlyQuantityKg = monthlyQuantityKg;
        this.durationMonths = durationMonths;
        this.minPriceLkr = minPriceLkr;
        this.maxPriceLkr = maxPriceLkr;
        this.qualityGrade = qualityGrade;
        this.deliveryFrequency = deliveryFrequency;
        this.status = status;
        this.applicantCount = applicantCount;
    }

    public String getId() { return id; }
    public String getBuyerName() { return buyerName; }
    public String getBuyerCategory() { return buyerCategory; }
    public String getCropName() { return cropName; }
    public int getMonthlyQuantityKg() { return monthlyQuantityKg; }
    public int getDurationMonths() { return durationMonths; }
    public BigDecimal getMinPriceLkr() { return minPriceLkr; }
    public BigDecimal getMaxPriceLkr() { return maxPriceLkr; }
    public String getQualityGrade() { return qualityGrade; }
    public String getDeliveryFrequency() { return deliveryFrequency; }
    public String getStatus() { return status; }
    public int getApplicantCount() { return applicantCount; }
}
