package com.example.agrolink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_transaction", columnList = "transactionId"),
    @Index(name = "idx_payment_status", columnList = "status")
})
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔐 Stripe Checkout Session ID
    @Column(unique = true, nullable = false, length = 100)
    private String transactionId;

    // 🔐 Stripe Payment Intent ID
    @Column(length = 100)
    private String paymentIntentId;

    @NotNull
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

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
        if (this.status == PaymentStatus.SUCCESS) return; // idempotent
        this.status = PaymentStatus.SUCCESS;
    }

    public void markAsFailed() {
        this.status = PaymentStatus.FAILED;
    }

    public boolean isSuccessful() {
        return this.status == PaymentStatus.SUCCESS;
    }

    // ================== GETTERS ==================

    public Long getId() { return id; }

    public String getTransactionId() { return transactionId; }

    public String getPaymentIntentId() { return paymentIntentId; }

    public BigDecimal getAmount() { return amount; }

    public PaymentStatus getStatus() { return status; }

    public Order getOrder() { return order; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ================== SETTERS ==================

    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public void setPaymentIntentId(String paymentIntentId) { this.paymentIntentId = paymentIntentId; }

    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public void setStatus(PaymentStatus status) { this.status = status; }

    public void setOrder(Order order) { this.order = order; }
}