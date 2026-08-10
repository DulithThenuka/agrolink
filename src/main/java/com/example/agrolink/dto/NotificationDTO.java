package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class NotificationDTO {

    private final String id;
    private final String title;
    private final String message;
    private final String type; // ORDER_UPDATE, LOGISTICS_DISPATCH, ESCROW_RELEASE, WASTE_ALERT, SYSTEM
    private final boolean read;
    private final String timestamp;

    public NotificationDTO(String id, String title, String message, String type, boolean read, String timestamp) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.read = read;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public boolean isRead() { return read; }
    public String getTimestamp() { return timestamp; }
}
