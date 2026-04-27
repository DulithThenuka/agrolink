package com.example.agrolink.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OrderRequestDTO {

    @NotNull(message = "Crop ID is required")
    private Long cropId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 1000, message = "Quantity cannot exceed 1000")
    private Integer quantity;

    // ================== NORMALIZATION ==================

    public void normalize() {
        // future-proof (e.g., trimming or defaults)
        if (quantity != null && quantity < 1) {
            quantity = 1;
        }
    }

    // ================== GETTERS & SETTERS ==================

    public Long getCropId() { return cropId; }

    public void setCropId(Long cropId) { this.cropId = cropId; }

    public Integer getQuantity() { return quantity; }

    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}