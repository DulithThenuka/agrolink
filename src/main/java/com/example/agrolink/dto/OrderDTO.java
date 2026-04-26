package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderDTO {

    private final Long id;
    private final String cropName;
    private final int quantity;
    private final BigDecimal totalPrice;
    private final String status;
    private final LocalDateTime createdAt;

    public OrderDTO(Long id,
                    String cropName,
                    int quantity,
                    BigDecimal totalPrice,
                    String status,
                    LocalDateTime createdAt) {
        this.id = id;
        this.cropName = cropName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
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

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}