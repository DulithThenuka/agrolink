package com.example.agrolink.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String category;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String location;

    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(0)
    @Column(nullable = false)
    private int quantity;

    @Column(length = 255)
    private String imageUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ================== BUSINESS HELPERS ==================

    public boolean hasEnoughStock(int requestedQty) {
        return this.quantity >= requestedQty;
    }

    public void reduceStock(int qty) {
        if (qty < 0 || this.quantity < qty) {
            throw new IllegalArgumentException("Invalid stock operation");
        }
        this.quantity -= qty;
    }

    // ================== GETTERS ==================

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getCategory() { return category; }

    public String getLocation() { return location; }

    public BigDecimal getPrice() { return price; }

    public int getQuantity() { return quantity; }

    public String getImageUrl() { return imageUrl; }

    public boolean isActive() { return active; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public User getFarmer() { return farmer; }

    // ================== SETTERS ==================

    public void setName(String name) { this.name = name; }

    public void setCategory(String category) { this.category = category; }

    public void setLocation(String location) { this.location = location; }

    public void setPrice(BigDecimal price) { this.price = price; }

    public void setQuantity(int quantity) { this.quantity = quantity; }

    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public void setActive(boolean active) { this.active = active; }

    public void setFarmer(User farmer) { this.farmer = farmer; }
}