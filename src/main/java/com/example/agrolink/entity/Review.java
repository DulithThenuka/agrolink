package com.example.agrolink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews",
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_review_buyer_crop", columnNames = {"buyer_id", "crop_id"})
       },
       indexes = {
           @Index(name = "idx_review_crop", columnList = "crop_id"),
           @Index(name = "idx_review_buyer", columnList = "buyer_id")
       })
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(nullable = false)
    private int rating;

    @Size(max = 500, message = "Comment must be less than 500 characters")
    @Column(length = 500)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ================== DOMAIN METHODS ==================

    public void updateReview(int rating, String comment) {
        this.rating = rating;
        this.comment = comment;
    }

    // ================== GETTERS ==================

    public Long getId() { return id; }

    public int getRating() { return rating; }

    public String getComment() { return comment; }

    public User getBuyer() { return buyer; }

    public Crop getCrop() { return crop; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ================== SETTERS ==================

    public void setRating(int rating) { this.rating = rating; }

    public void setComment(String comment) { this.comment = comment; }

    public void setBuyer(User buyer) { this.buyer = buyer; }

    public void setCrop(Crop crop) { this.crop = crop; }
}