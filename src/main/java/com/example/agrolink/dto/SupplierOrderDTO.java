package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class SupplierOrderDTO {

    private final Long id;
    private final Long supplierItemId;
    private final String supplierItemName;
    private final String category;
    private final String supplierEmail;
    private final String farmerEmail;
    private final String farmerName;
    private final int quantity;
    private final BigDecimal totalPrice;
    private final String status;
    private final LocalDateTime createdAt;

    public SupplierOrderDTO(Long id,
                            Long supplierItemId,
                            String supplierItemName,
                            String category,
                            String supplierEmail,
                            String farmerEmail,
                            String farmerName,
                            int quantity,
                            BigDecimal totalPrice,
                            String status,
                            LocalDateTime createdAt) {
        this.id = id;
        this.supplierItemId = supplierItemId;
        this.supplierItemName = supplierItemName;
        this.category = category;
        this.supplierEmail = supplierEmail;
        this.farmerEmail = farmerEmail;
        this.farmerName = farmerName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getSupplierItemId() { return supplierItemId; }
    public String getSupplierItemName() { return supplierItemName; }
    public String getCategory() { return category; }
    public String getSupplierEmail() { return supplierEmail; }
    public String getFarmerEmail() { return farmerEmail; }
    public String getFarmerName() { return farmerName; }
    public int getQuantity() { return quantity; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
