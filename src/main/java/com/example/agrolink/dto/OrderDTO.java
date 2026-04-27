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

    private final LocalDateTime createdAt;

    public OrderDTO(Long id,
                    String cropName,
                    Long cropId,
                    int quantity,
                    BigDecimal totalPrice,
                    String status,
                    String statusLabel,
                    boolean isPaid,
                    LocalDateTime createdAt) {

        this.id = id;
        this.cropName = cropName;
        this.cropId = cropId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.statusLabel = statusLabel;
        this.isPaid = isPaid;
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

    public LocalDateTime getCreatedAt() { return createdAt; }
}