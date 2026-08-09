package com.example.agrolink.dto;

import java.math.BigDecimal;

public final class RentalEquipmentDTO {

    private final Long id;
    private final String name;
    private final String category;
    private final String location;
    private final BigDecimal dailyRateLkr;
    private final String availableFrom;
    private final String availableTo;
    private final double rating;
    private final String ownerEmail;
    private final String ownerName;
    private final String description;
    private final String imageUrl;
    private final boolean active;

    public RentalEquipmentDTO(Long id,
                              String name,
                              String category,
                              String location,
                              BigDecimal dailyRateLkr,
                              String availableFrom,
                              String availableTo,
                              double rating,
                              String ownerEmail,
                              String ownerName,
                              String description,
                              String imageUrl,
                              boolean active) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.location = location;
        this.dailyRateLkr = dailyRateLkr;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
        this.rating = rating;
        this.ownerEmail = ownerEmail;
        this.ownerName = ownerName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.active = active;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getLocation() { return location; }
    public BigDecimal getDailyRateLkr() { return dailyRateLkr; }
    public String getAvailableFrom() { return availableFrom; }
    public String getAvailableTo() { return availableTo; }
    public double getRating() { return rating; }
    public String getOwnerEmail() { return ownerEmail; }
    public String getOwnerName() { return ownerName; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public boolean isActive() { return active; }
}
