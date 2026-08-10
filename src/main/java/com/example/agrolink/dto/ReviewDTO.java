package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class ReviewDTO {

    private final Long id;
    private final int rating;
    private final String comment;
    private final String buyerEmail;
    private final Long cropId;
    private final String cropName;
    private final LocalDateTime createdAt;

    public ReviewDTO(Long id, int rating, String comment, String buyerEmail, Long cropId, String cropName, LocalDateTime createdAt) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.buyerEmail = buyerEmail;
        this.cropId = cropId;
        this.cropName = cropName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public String getBuyerEmail() { return buyerEmail; }
    public Long getCropId() { return cropId; }
    public String getCropName() { return cropName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
