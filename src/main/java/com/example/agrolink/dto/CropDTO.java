package com.example.agrolink.dto;

import java.math.BigDecimal;

public class CropDTO {

    private Long id;
    private String name;
    private String category;
    private String location;
    private BigDecimal price;
    private int quantity;
    private String image;
    private String farmerName;

    public CropDTO() {}

    public CropDTO(Long id, String name, String category, String location,
                   BigDecimal price, int quantity, String image, String farmerName) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.location = location;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
        this.farmerName = farmerName;
    }

    // ✅ Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
}