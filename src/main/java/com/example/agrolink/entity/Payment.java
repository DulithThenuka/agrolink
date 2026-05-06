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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_transaction",
                columnList = "transactionId"),
        @Index(name = "idx_payment_status",
                columnList = "status")
})
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Stripe Checkout Session ID
    @Column(unique = true, nullable = false, length = 100)
    private String transactionId;

    // Stripe Payment Intent ID
    @Column(length = 100)
    private String paymentIntentId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01",
            message = "Amount must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id",
            nullable = false,
            unique = true)
    private Order order;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // ================== CONSTRUCTORS ==================

    public Payment() {
    }

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        if (this.status == null) {
            this.status = PaymentStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ================== DOMAIN METHODS ==================

    public void markAsPaid() {

        if (this.status == PaymentStatus.SUCCESS) {
            return;
        }

        this.status = PaymentStatus.SUCCESS;
    }

    public void markAsFailed() {
        this.status = PaymentStatus.FAILED;
    }

    public boolean isSuccessful() {
        return this.status == PaymentStatus.SUCCESS;
    }

    // ================== GETTERS ==================

    public Long getId() {
        return id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public Order getOrder() {
        return order;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Long getVersion() {
        return version;
    }

    // ================== SETTERS ==================

    public void setTransactionId(String transactionId) {

        this.transactionId = transactionId == null
                ? null
                : transactionId.trim();
    }

    public void setPaymentIntentId(String paymentIntentId) {

        this.paymentIntentId = paymentIntentId == null
                ? null
                : paymentIntentId.trim();
    }

    public void setAmount(BigDecimal amount) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be greater than zero"
            );
        }

        this.amount = amount;
    }

    public void setStatus(PaymentStatus status) {

        if (status == null) {

            throw new IllegalArgumentException(
                    "Payment status cannot be null"
            );
        }

        this.status = status;
    }

    public void setOrder(Order order) {

        if (order == null) {

            throw new IllegalArgumentException(
                    "Order cannot be null"
            );
        }

        this.order = order;
    }
}