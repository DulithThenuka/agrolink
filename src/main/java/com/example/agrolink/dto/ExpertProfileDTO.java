package com.example.agrolink.dto;

public final class ExpertProfileDTO {

    private final Long id;
    private final String name;
    private final String title;
    private final String specialty; // Agricultural Officer, Veterinarian, Agronomist, Soil Specialist
    private final String district;
    private final double rating;
    private final int consultationsCount;
    private final String availabilityStatus;
    private final String avatarUrl;

    public ExpertProfileDTO(Long id,
                            String name,
                            String title,
                            String specialty,
                            String district,
                            double rating,
                            int consultationsCount,
                            String availabilityStatus,
                            String avatarUrl) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.specialty = specialty;
        this.district = district;
        this.rating = rating;
        this.consultationsCount = consultationsCount;
        this.availabilityStatus = availabilityStatus;
        this.avatarUrl = avatarUrl;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getTitle() { return title; }
    public String getSpecialty() { return specialty; }
    public String getDistrict() { return district; }
    public double getRating() { return rating; }
    public int getConsultationsCount() { return consultationsCount; }
    public String getAvailabilityStatus() { return availabilityStatus; }
    public String getAvatarUrl() { return avatarUrl; }
}
