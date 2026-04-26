package com.example.agrolink.dto;

import java.math.BigDecimal;

public class CropDTO {

    private final Long id;
    private final String name;
    private final String category;
    private final String location;
    private final BigDecimal price;
    private final int quantity;
    private final String imageUrl;
    private final String farmerName;

    public CropDTO(Long id,
                   String name,
                   String category,
                   String location,
                   BigDecimal price,
                   int quantity,
                   String imageUrl,
                   String farmerName) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.location = location;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.farmerName = farmerName;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getLocation() {
        return location;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getFarmerName() {
        return farmerName;
    }
}