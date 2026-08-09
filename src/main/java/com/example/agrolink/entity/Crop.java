package com.example.agrolink.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Crop name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Category is required")
    @Column(nullable = false, length = 50)
    private String category;

    @NotBlank(message = "Location is required")
    @Column(nullable = false, length = 100)
    private String location;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(nullable = false)
    private int quantity;

    @Column(length = 255)
    private String imageUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 50)
    private String batchCode;

    @Column(length = 50)
    private String harvestedDate = "August 4, 2026";

    @Column(length = 50)
    private String packedDate = "August 5, 2026";

    @Column(length = 50)
    private String transportVehicle = "Vehicle WP LK-4892";

    @Column(length = 100)
    private String qualityInspectionStatus = "Passed (Grade A Organic)";

    @Column(length = 50)
    private String deliveredDate = "August 6, 2026";

    @Column(length = 100)
    private String blockchainHash = "0x7f8a92b4c19e81d763a1290f";

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    // ================== CONSTRUCTORS ==================

    public Crop() {
    }

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ================== BUSINESS HELPERS ==================

    public boolean hasEnoughStock(int requestedQty) {
        return requestedQty > 0 && this.quantity >= requestedQty;
    }

    public void reduceStock(int qty) {

        if (qty <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than 0"
            );
        }

        if (this.quantity < qty) {
            throw new IllegalArgumentException(
                    "Insufficient stock"
            );
        }

        this.quantity -= qty;
    }

    // ================== GETTERS ==================

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

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public User getFarmer() {
        return farmer;
    }

    // ================== SETTERS ==================

    public void setName(String name) {
        this.name = name == null
                ? null
                : name.trim();
    }

    public void setCategory(String category) {
        this.category = category == null
                ? null
                : category.trim();
    }

    public void setLocation(String location) {
        this.location = location == null
                ? null
                : location.trim();
    }

    public void setPrice(BigDecimal price) {

        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Price must be greater than zero"
            );
        }

        this.price = price;
    }

    public void setQuantity(int quantity) {

        if (quantity < 0) {
            throw new IllegalArgumentException(
                    "Quantity cannot be negative"
            );
        }

        this.quantity = quantity;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setFarmer(User farmer) {

        if (farmer == null) {
            throw new IllegalArgumentException(
                    "Farmer cannot be null"
            );
        }

        this.farmer = farmer;
    }

    public String getBatchCode() {
        return (batchCode != null && !batchCode.isBlank()) ? batchCode : ("BATCH-2026-NWR-" + (id != null ? String.format("%04d", id) : "0941"));
    }

    public void setBatchCode(String batchCode) {
        this.batchCode = batchCode;
    }

    public String getHarvestedDate() {
        return harvestedDate != null ? harvestedDate : "August 4, 2026";
    }

    public void setHarvestedDate(String harvestedDate) {
        this.harvestedDate = harvestedDate;
    }

    public String getPackedDate() {
        return packedDate != null ? packedDate : "August 5, 2026";
    }

    public void setPackedDate(String packedDate) {
        this.packedDate = packedDate;
    }

    public String getTransportVehicle() {
        return transportVehicle != null ? transportVehicle : "Vehicle WP LK-4892";
    }

    public void setTransportVehicle(String transportVehicle) {
        this.transportVehicle = transportVehicle;
    }

    public String getQualityInspectionStatus() {
        return qualityInspectionStatus != null ? qualityInspectionStatus : "Passed (Grade A Organic)";
    }

    public void setQualityInspectionStatus(String qualityInspectionStatus) {
        this.qualityInspectionStatus = qualityInspectionStatus;
    }

    public String getDeliveredDate() {
        return deliveredDate != null ? deliveredDate : "August 6, 2026";
    }

    public void setDeliveredDate(String deliveredDate) {
        this.deliveredDate = deliveredDate;
    }

    public String getBlockchainHash() {
        return blockchainHash != null ? blockchainHash : "0x7f8a92b4c19e81d763a1290f";
    }

    public void setBlockchainHash(String blockchainHash) {
        this.blockchainHash = blockchainHash;
    }
}