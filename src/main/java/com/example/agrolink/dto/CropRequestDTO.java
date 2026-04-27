package com.example.agrolink.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class CropRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must be less than 50 characters")
    private String category;

    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must be less than 100 characters")
    private String location;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Invalid price format")
    private BigDecimal price;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 100000, message = "Quantity is too large")
    private int quantity;

    // ================== NORMALIZATION ==================

    public void normalize() {
        if (name != null) name = name.trim();
        if (category != null) category = category.trim();
        if (location != null) location = location.trim();
    }

    // ================== GETTERS & SETTERS ==================

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
}