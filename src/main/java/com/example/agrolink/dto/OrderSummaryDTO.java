package com.example.agrolink.dto;

import java.time.LocalDateTime;

public class OrderSummaryDTO {

    private Long id;
    private String cropName;
    private Integer quantity;
    private String buyerEmail;
    private String status;
    private LocalDateTime createdAt;

    // ✅ Default constructor (important)
    public OrderSummaryDTO() {}

    public OrderSummaryDTO(Long id, String cropName, Integer quantity,
                           String buyerEmail, String status,
                           LocalDateTime createdAt) {
        this.id = id;
        this.cropName = cropName;
        this.quantity = quantity;
        this.buyerEmail = buyerEmail;
        this.status = status;
        this.createdAt = createdAt;
    }

    // getters
    public Long getId() { return id; }
    public String getCropName() { return cropName; }
    public Integer getQuantity() { return quantity; }
    public String getBuyerEmail() { return buyerEmail; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}