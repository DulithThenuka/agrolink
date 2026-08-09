package com.example.agrolink.dto;

import java.math.BigDecimal;

public final class SupplierItemDTO {

    private final Long id;
    private final String name;
    private final String category;
    private final String supplierEmail;
    private final String supplierName;
    private final String brand;
    private final String description;
    private final BigDecimal price;
    private final int quantity;
    private final String imageUrl;
    private final boolean active;

    public SupplierItemDTO(Long id,
                           String name,
                           String category,
                           String supplierEmail,
                           String supplierName,
                           String brand,
                           String description,
                           BigDecimal price,
                           int quantity,
                           String imageUrl,
                           boolean active) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.supplierEmail = supplierEmail;
        this.supplierName = supplierName;
        this.brand = brand;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.active = active;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getSupplierEmail() { return supplierEmail; }
    public String getSupplierName() { return supplierName; }
    public String getBrand() { return brand; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public String getImageUrl() { return imageUrl; }
    public boolean isActive() { return active; }
}
