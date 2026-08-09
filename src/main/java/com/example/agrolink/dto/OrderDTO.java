package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class OrderDTO {

    private final Long id;

    private final String cropName;
    private final Long cropId;

    private final int quantity;
    private final BigDecimal totalPrice;

    private final String status;
    private final String statusLabel;

    private final boolean isPaid;

    private final String buyerName;
    private final String buyerEmail;
    private final String farmerName;

    private final String pickupLocation;
    private final String deliveryLocation;
    private final Integer distanceKm;
    private final BigDecimal logisticsFee;
    private final String driverName;
    private final String driverEmail;
    private final Double currentLat;
    private final Double currentLng;
    private final String trackingNotes;

    private final String escrowStatus;
    private final String escrowStatusLabel;
    private final String disputeReason;
    private final String disputeResolution;
    private final LocalDateTime disputeRaisedAt;

    private final LocalDateTime createdAt;

    public OrderDTO(Long id,
                    String cropName,
                    Long cropId,
                    int quantity,
                    BigDecimal totalPrice,
                    String status,
                    String statusLabel,
                    boolean isPaid,
                    String buyerName,
                    String buyerEmail,
                    String farmerName,
                    String pickupLocation,
                    String deliveryLocation,
                    Integer distanceKm,
                    BigDecimal logisticsFee,
                    String driverName,
                    String driverEmail,
                    Double currentLat,
                    Double currentLng,
                    String trackingNotes,
                    String escrowStatus,
                    String escrowStatusLabel,
                    String disputeReason,
                    String disputeResolution,
                    LocalDateTime disputeRaisedAt,
                    LocalDateTime createdAt) {

        this.id = id;
        this.cropName = cropName;
        this.cropId = cropId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.statusLabel = statusLabel;
        this.isPaid = isPaid;
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.farmerName = farmerName;
        this.pickupLocation = pickupLocation;
        this.deliveryLocation = deliveryLocation;
        this.distanceKm = distanceKm;
        this.logisticsFee = logisticsFee;
        this.driverName = driverName;
        this.driverEmail = driverEmail;
        this.currentLat = currentLat;
        this.currentLng = currentLng;
        this.trackingNotes = trackingNotes;
        this.escrowStatus = escrowStatus;
        this.escrowStatusLabel = escrowStatusLabel;
        this.disputeReason = disputeReason;
        this.disputeResolution = disputeResolution;
        this.disputeRaisedAt = disputeRaisedAt;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }

    public String getCropName() { return cropName; }

    public Long getCropId() { return cropId; }

    public int getQuantity() { return quantity; }

    public BigDecimal getTotalPrice() { return totalPrice; }

    public String getStatus() { return status; }

    public String getStatusLabel() { return statusLabel; }

    public boolean isPaid() { return isPaid; }

    public String getBuyerName() { return buyerName; }

    public String getBuyerEmail() { return buyerEmail; }

    public String getFarmerName() { return farmerName; }

    public String getPickupLocation() { return pickupLocation; }

    public String getDeliveryLocation() { return deliveryLocation; }

    public Integer getDistanceKm() { return distanceKm; }

    public BigDecimal getLogisticsFee() { return logisticsFee; }

    public String getDriverName() { return driverName; }

    public String getDriverEmail() { return driverEmail; }

    public Double getCurrentLat() { return currentLat; }

    public Double getCurrentLng() { return currentLng; }

    public String getTrackingNotes() { return trackingNotes; }

    public String getEscrowStatus() { return escrowStatus; }

    public String getEscrowStatusLabel() { return escrowStatusLabel; }

    public String getDisputeReason() { return disputeReason; }

    public String getDisputeResolution() { return disputeResolution; }

    public LocalDateTime getDisputeRaisedAt() { return disputeRaisedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}