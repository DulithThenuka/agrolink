package com.example.agrolink.dto;

import java.math.BigDecimal;

public final class CropDTO {

    private final Long id;
    private final String name;
    private final String category;
    private final String location;
    private final BigDecimal price;
    private final int quantity;
    private final String imageUrl;

    private final String farmerName;
    private final Long farmerId;
    private final String batchCode;

    private final boolean inStock;
    private final boolean active;

    public CropDTO(Long id, String name, String category, String location, BigDecimal price, int quantity, String imageUrl, String farmerName, Long farmerId, boolean active, String batchCode) {

        this.id = id;
        this.name = name;
        this.category = category;
        this.location = location;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.farmerName = farmerName;
        this.farmerId = farmerId;
        this.batchCode = batchCode != null && !batchCode.isBlank() ? batchCode : ("BATCH-2026-NWR-" + (id != null ? String.format("%04d", id) : "0941"));
        this.active = active;
        this.inStock = quantity > 0;
    }

    public CropDTO(Long id, String name, String category, String location, BigDecimal price, int quantity, String imageUrl, String farmerName, Long farmerId, boolean active) {
        this(id, name, category, location, price, quantity, imageUrl, farmerName, farmerId, active, null);
    }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getCategory() { return category; }

    public String getLocation() { return location; }

    public BigDecimal getPrice() { return price; }

    public int getQuantity() { return quantity; }

    public String getImageUrl() { return imageUrl; }

    public String getFarmerName() { return farmerName; }

    public Long getFarmerId() { return farmerId; }

    public String getBatchCode() { return batchCode; }

    public boolean isInStock() { return inStock; }

    public boolean isActive() { return active; }

    public String getQualityGrade() { return "Grade A"; }

    public boolean isOrganic() { return true; }

    public String getHarvestDateText() { return "Today"; }

    public BigDecimal getMarketAveragePrice() {
        return price != null ? price.multiply(new BigDecimal("1.07")).setScale(2, java.math.RoundingMode.HALF_UP) : new BigDecimal("225.00");
    }

    public double getSavingsPercentage() { return 6.7; }

    public double getRating() { return 4.8; }

    public int getTransactionCount() { return 327; }

    public boolean isFarmerVerified() { return true; }
}