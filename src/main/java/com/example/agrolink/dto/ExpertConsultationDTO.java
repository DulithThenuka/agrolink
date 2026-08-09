package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class ExpertConsultationDTO {

    private final Long id;
    private final String farmerEmail;
    private final String farmerName;
    private final String expertName;
    private final String expertSpecialty;
    private final String question;
    private final String farmData;
    private final String imageUrl;
    private final String status;
    private final String reply;
    private final LocalDateTime createdAt;
    private final LocalDateTime answeredAt;

    public ExpertConsultationDTO(Long id,
                                 String farmerEmail,
                                 String farmerName,
                                 String expertName,
                                 String expertSpecialty,
                                 String question,
                                 String farmData,
                                 String imageUrl,
                                 String status,
                                 String reply,
                                 LocalDateTime createdAt,
                                 LocalDateTime answeredAt) {
        this.id = id;
        this.farmerEmail = farmerEmail;
        this.farmerName = farmerName;
        this.expertName = expertName;
        this.expertSpecialty = expertSpecialty;
        this.question = question;
        this.farmData = farmData;
        this.imageUrl = imageUrl;
        this.status = status;
        this.reply = reply;
        this.createdAt = createdAt;
        this.answeredAt = answeredAt;
    }

    public Long getId() { return id; }
    public String getFarmerEmail() { return farmerEmail; }
    public String getFarmerName() { return farmerName; }
    public String getExpertName() { return expertName; }
    public String getExpertSpecialty() { return expertSpecialty; }
    public String getQuestion() { return question; }
    public String getFarmData() { return farmData; }
    public String getImageUrl() { return imageUrl; }
    public String getStatus() { return status; }
    public String getReply() { return reply; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getAnsweredAt() { return answeredAt; }
}
