package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class AuthResponseDTO {

    private final String accessToken;
    private final String tokenType;
    private final Long id;
    private final String name;
    private final String email;
    private final String location;
    private final String role;
    private final long expiresIn; // seconds
    private final LocalDateTime timestamp;

    public AuthResponseDTO(String accessToken,
                           Long id,
                           String name,
                           String email,
                           String location,
                           String role,
                           long expiresIn) {

        this.accessToken = accessToken;
        this.tokenType = "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
        this.location = location;
        this.role = role;
        this.expiresIn = expiresIn;
        this.timestamp = LocalDateTime.now();
    }

    public AuthResponseDTO(String accessToken,
                           String email,
                           String role,
                           long expiresIn) {
        this(accessToken, null, null, email, null, role, expiresIn);
    }

    public String getAccessToken() { return accessToken; }

    public String getTokenType() { return tokenType; }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getEmail() { return email; }

    public String getLocation() { return location; }

    public String getRole() { return role; }

    public long getExpiresIn() { return expiresIn; }

    public LocalDateTime getTimestamp() { return timestamp; }
}