package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public final class EquipmentBookingDTO {

    private final Long id;
    private final Long equipmentId;
    private final String equipmentName;
    private final String category;
    private final String location;
    private final BigDecimal dailyRateLkr;
    private final String farmerEmail;
    private final String farmerName;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final long totalDays;
    private final BigDecimal totalCost;
    private final String status;
    private final LocalDateTime createdAt;

    public EquipmentBookingDTO(Long id,
                               Long equipmentId,
                               String equipmentName,
                               String category,
                               String location,
                               BigDecimal dailyRateLkr,
                               String farmerEmail,
                               String farmerName,
                               LocalDate startDate,
                               LocalDate endDate,
                               long totalDays,
                               BigDecimal totalCost,
                               String status,
                               LocalDateTime createdAt) {
        this.id = id;
        this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
        this.category = category;
        this.location = location;
        this.dailyRateLkr = dailyRateLkr;
        this.farmerEmail = farmerEmail;
        this.farmerName = farmerName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalDays = totalDays;
        this.totalCost = totalCost;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getEquipmentId() { return equipmentId; }
    public String getEquipmentName() { return equipmentName; }
    public String getCategory() { return category; }
    public String getLocation() { return location; }
    public BigDecimal getDailyRateLkr() { return dailyRateLkr; }
    public String getFarmerEmail() { return farmerEmail; }
    public String getFarmerName() { return farmerName; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public long getTotalDays() { return totalDays; }
    public BigDecimal getTotalCost() { return totalCost; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
