package com.example.agrolink.dto;

import java.time.LocalDateTime;

public class AuthResponseDTO {

    private final String token;
    private final String type;
    private final String email;
    private final String role;
    private final LocalDateTime timestamp;

    public AuthResponseDTO(String token, String email, String role) {
        this.token = token;
        this.type = "Bearer";
        this.email = email;
        this.role = role;
        this.timestamp = LocalDateTime.now();
    }

    public String getToken() {
        return token;
    }

    public String getType() {
        return type;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}