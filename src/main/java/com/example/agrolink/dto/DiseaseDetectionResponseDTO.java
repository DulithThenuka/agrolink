package com.example.agrolink.dto;

import java.util.List;

public final class DiseaseDetectionResponseDTO {

    private final String detectedDisease;
    private final String scientificName;
    private final double confidencePercentage;
    private final String severityLevel;
    private final List<String> recommendedActions;
    private final ExpertContact nearbyExpert;

    public DiseaseDetectionResponseDTO(String detectedDisease,
                                       String scientificName,
                                       double confidencePercentage,
                                       String severityLevel,
                                       List<String> recommendedActions,
                                       ExpertContact nearbyExpert) {
        this.detectedDisease = detectedDisease;
        this.scientificName = scientificName;
        this.confidencePercentage = confidencePercentage;
        this.severityLevel = severityLevel;
        this.recommendedActions = recommendedActions != null ? List.copyOf(recommendedActions) : List.of();
        this.nearbyExpert = nearbyExpert;
    }

    public String getDetectedDisease() { return detectedDisease; }
    public String getScientificName() { return scientificName; }
    public double getConfidencePercentage() { return confidencePercentage; }
    public String getSeverityLevel() { return severityLevel; }
    public List<String> getRecommendedActions() { return recommendedActions; }
    public ExpertContact getNearbyExpert() { return nearbyExpert; }

    public static final class ExpertContact {
        private final String name;
        private final String title;
        private final String phone;
        private final String officeLocation;

        public ExpertContact(String name, String title, String phone, String officeLocation) {
            this.name = name;
            this.title = title;
            this.phone = phone;
            this.officeLocation = officeLocation;
        }

        public String getName() { return name; }
        public String getTitle() { return title; }
        public String getPhone() { return phone; }
        public String getOfficeLocation() { return officeLocation; }
    }
}
