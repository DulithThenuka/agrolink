package com.example.agrolink.dto;

public class DiseaseDetectionRequestDTO {

    private String sampleCrop;
    private String imageUrl;

    public DiseaseDetectionRequestDTO() {}

    public DiseaseDetectionRequestDTO(String sampleCrop, String imageUrl) {
        this.sampleCrop = sampleCrop;
        this.imageUrl = imageUrl;
    }

    public String getSampleCrop() { return sampleCrop; }
    public void setSampleCrop(String sampleCrop) { this.sampleCrop = sampleCrop; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
