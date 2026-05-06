package com.example.agrolink.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

@Entity
@Table(
        name = "reviews",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_review_buyer_crop",
                        columnNames = {"buyer_id", "crop_id"}
                )
        },
        indexes = {
                @Index(name = "idx_review_crop", columnList = "crop_id"),
                @Index(name = "idx_review_buyer", columnList = "buyer_id")
        }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(nullable = false)
    private int rating;

    @Size(max = 500,
            message = "Comment must be less than 500 characters")
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

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // ================== CONSTRUCTORS ==================

    public Review() {
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

    // ================== DOMAIN METHODS ==================

    public void updateReview(int rating, String comment) {

        setRating(rating);
        setComment(comment);
    }

    // ================== GETTERS ==================

    public Long getId() {
        return id;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public User getBuyer() {
        return buyer;
    }

    public Crop getCrop() {
        return crop;
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

    public void setRating(int rating) {

        if (rating < 1 || rating > 5) {

            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );
        }

        this.rating = rating;
    }

    public void setComment(String comment) {

        if (comment != null) {

            comment = comment.trim();

            if (comment.length() > 500) {

                throw new IllegalArgumentException(
                        "Comment cannot exceed 500 characters"
                );
            }
        }

        this.comment = comment;
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