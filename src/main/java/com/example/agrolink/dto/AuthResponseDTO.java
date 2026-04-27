package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class AuthResponseDTO {

    private final String accessToken;
    private final String tokenType;
    private final String email;
    private final String role;
    private final long expiresIn; // seconds
    private final LocalDateTime timestamp;

    public AuthResponseDTO(String accessToken,
                           String email,
                           String role,
                           long expiresIn) {

        this.accessToken = accessToken;
        this.tokenType = "Bearer";
        this.email = email;
        this.role = role;
        this.expiresIn = expiresIn;
        this.timestamp = LocalDateTime.now();
    }

    public String getAccessToken() { return accessToken; }

    public String getTokenType() { return tokenType; }

    public String getEmail() { return email; }

    public String getRole() { return role; }

    public long getExpiresIn() { return expiresIn; }

    public LocalDateTime getTimestamp() { return timestamp; }
}