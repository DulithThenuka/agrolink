package com.example.agrolink.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_buyer", columnList = "buyer_id"),
        @Index(name = "idx_order_created", columnList = "createdAt"),
        @Index(name = "idx_order_status", columnList = "status")
})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    private int quantity;

    @NotNull(message = "Total price is required")
    @DecimalMin(value = "0.01",
            message = "Total price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Version
    private Long version;

    // ================== CONSTRUCTORS ==================

    public Order() {
    }

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        if (this.status == null) {
            this.status = OrderStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ================== DOMAIN METHODS ==================

    public void markAsConfirmed() {

        if (this.status == OrderStatus.CONFIRMED) {
            return;
        }

        this.status = OrderStatus.CONFIRMED;
    }

    public void cancel() {

        if (this.status == OrderStatus.CONFIRMED) {
            throw new IllegalStateException(
                    "Cannot cancel a confirmed order"
            );
        }

        this.status = OrderStatus.CANCELLED;
    }

    public boolean isPaid() {
        return this.status == OrderStatus.CONFIRMED;
    }

    // ================== GETTERS ==================

    public Long getId() {
        return id;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public User getBuyer() {
        return buyer;
    }

    public Crop getCrop() {
        return crop;
    }

    public Long getVersion() {
        return version;
    }

    // ================== SETTERS ==================

    public void setQuantity(int quantity) {

        if (quantity < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1"
            );
        }

        this.quantity = quantity;
    }

    public void setTotalPrice(BigDecimal totalPrice) {

        if (totalPrice == null ||
                totalPrice.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Total price must be greater than zero"
            );
        }

        this.totalPrice = totalPrice;
    }

    public void setStatus(OrderStatus status) {

        if (status == null) {
            throw new IllegalArgumentException(
                    "Status cannot be null"
            );
        }

        this.status = status;
    }

    public void setBuyer(User buyer) {

        if (buyer == null) {
            throw new IllegalArgumentException(
                    "Buyer cannot be null"
            );
        }

        this.buyer = buyer;
    }

    public void setCrop(Crop crop) {

        if (crop == null) {
            throw new IllegalArgumentException(
                    "Crop cannot be null"
            );
        }

        this.crop = crop;
    }
}