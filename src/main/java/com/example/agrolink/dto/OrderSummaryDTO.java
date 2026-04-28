package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class OrderSummaryDTO {

    private final Long id;

    private final String cropName;
    private final Long cropId;

    private final int quantity;

    private final String buyerEmail;

    private final String status;
    private final String statusLabel;

    private final boolean paid;

    private final LocalDateTime createdAt;

    public OrderSummaryDTO(Long id,
                           String cropName,
                           Long cropId,
                           int quantity,
                           String buyerEmail,
                           String status,
                           String statusLabel,
                           boolean paid,
                           LocalDateTime createdAt) {

        this.id = id;
        this.cropName = cropName;
        this.cropId = cropId;
        this.quantity = quantity;
        this.buyerEmail = buyerEmail;
        this.status = status;
        this.statusLabel = statusLabel;
        this.paid = paid;
        this.createdAt = createdAt;
    }

    public OrderSummaryDTO(Object id2, String cropName2, int quantity2, String buyerEmail2, String status2,
            LocalDateTime createdAt2) {
        //TODO Auto-generated constructor stub
    }

    public Long getId() { return id; }

    public String getCropName() { return cropName; }

    public Long getCropId() { return cropId; }

    public int getQuantity() { return quantity; }

    public String getBuyerEmail() { return buyerEmail; }

    public String getStatus() { return status; }

    public String getStatusLabel() { return statusLabel; }

    public boolean isPaid() { return paid; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}