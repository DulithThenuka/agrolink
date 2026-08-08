package com.example.agrolink.dto;

public class PricePredictionRequestDTO {

    private String cropName;
    private String location;

    public PricePredictionRequestDTO() {}

    public PricePredictionRequestDTO(String cropName, String location) {
        this.cropName = cropName;
        this.location = location;
    }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
