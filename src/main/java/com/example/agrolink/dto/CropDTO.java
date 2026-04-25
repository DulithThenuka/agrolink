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

    // getters & setters
}