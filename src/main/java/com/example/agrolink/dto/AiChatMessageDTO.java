package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class AiChatMessageDTO {

    private final String sender; // USER or AI
    private final String text;
    private final String timestamp;

    public AiChatMessageDTO(String sender, String text, String timestamp) {
        this.sender = sender;
        this.text = text;
        this.timestamp = timestamp;
    }

    public String getSender() { return sender; }
    public String getText() { return text; }
    public String getTimestamp() { return timestamp; }
}
