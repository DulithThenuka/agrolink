package com.example.agrolink.dto;

import java.util.List;

public final class AiChatDTO {

    private final String message;
    private final String language; // EN, SI, TA
    private final String district;
    private final Integer plantAgeDays;
    private final String imageUrl;
    private final String cropName;
    private final List<AiChatMessageDTO> messages;
    private final String aiResponseText;
    private final boolean requiresExpertConfirmation;

    public AiChatDTO(String message,
                     String language,
                     String district,
                     Integer plantAgeDays,
                     String imageUrl,
                     String cropName,
                     List<AiChatMessageDTO> messages,
                     String aiResponseText,
                     boolean requiresExpertConfirmation) {
        this.message = message;
        this.language = language;
        this.district = district;
        this.plantAgeDays = plantAgeDays;
        this.imageUrl = imageUrl;
        this.cropName = cropName;
        this.messages = messages;
        this.aiResponseText = aiResponseText;
        this.requiresExpertConfirmation = requiresExpertConfirmation;
    }

    public String getMessage() { return message; }
    public String getLanguage() { return language; }
    public String getDistrict() { return district; }
    public Integer getPlantAgeDays() { return plantAgeDays; }
    public String getImageUrl() { return imageUrl; }
    public String getCropName() { return cropName; }
    public List<AiChatMessageDTO> getMessages() { return messages; }
    public String getAiResponseText() { return aiResponseText; }
    public boolean isRequiresExpertConfirmation() { return requiresExpertConfirmation; }
}
