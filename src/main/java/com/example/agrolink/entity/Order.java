package com.example.agrolink.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_order_buyer", columnList = "buyer_id"),
    @Index(name = "idx_order_created", columnList = "createdAt"),
    @Index(name = "idx_order_status", columnList = "status")
})
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Column(nullable = false)
    private int quantity;

    @NotNull
    @DecimalMin(value = "0.01", message = "Total price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Version
    private Long version;

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

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
            return; // idempotent
        }
        this.status = OrderStatus.CONFIRMED;
    }

    public void cancel() {
        if (this.status == OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Cannot cancel a confirmed order");
        }
        this.status = OrderStatus.CANCELLED;
    }

    public boolean isPaid() {
        return this.status == OrderStatus.CONFIRMED;
    }
}