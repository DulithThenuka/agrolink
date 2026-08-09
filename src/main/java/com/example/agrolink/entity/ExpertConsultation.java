package com.example.agrolink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expert_consultations")
public class ExpertConsultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String farmerEmail;

    @Column(length = 100)
    private String farmerName;

    @Column(length = 100)
    private String expertName;

    @Column(nullable = false, length = 100)
    private String expertSpecialty = "Agronomist"; // Agronomist, Agricultural Officer, Veterinarian, Soil Specialist

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(length = 255)
    private String farmData;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, ANSWERED, BOOKED

    @Column(columnDefinition = "TEXT")
    private String reply;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime answeredAt;

    public ExpertConsultation() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFarmerEmail() { return farmerEmail; }
    public void setFarmerEmail(String farmerEmail) { this.farmerEmail = farmerEmail; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getExpertName() { return expertName; }
    public void setExpertName(String expertName) { this.expertName = expertName; }

    public String getExpertSpecialty() { return expertSpecialty; }
    public void setExpertSpecialty(String expertSpecialty) { this.expertSpecialty = expertSpecialty; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getFarmData() { return farmData; }
    public void setFarmData(String farmData) { this.farmData = farmData; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(LocalDateTime answeredAt) { this.answeredAt = answeredAt; }
}
