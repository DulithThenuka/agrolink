package com.example.agrolink.dto;

import java.time.LocalDateTime;

public class OrderSummaryDTO {

    private final Long id;
    private final String cropName;
    private final int quantity;
    private final String buyerEmail;
    private final String status;
    private final LocalDateTime createdAt;

    public OrderSummaryDTO(Long id,
                           String cropName,
                           int quantity,
                           String buyerEmail,
                           String status,
                           LocalDateTime createdAt) {
        this.id = id;
        this.cropName = cropName;
        this.quantity = quantity;
        this.buyerEmail = buyerEmail;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getCropName() {
        return cropName;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getBuyerEmail() {
        return buyerEmail;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}