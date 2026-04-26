package com.example.agrolink.dto;

public class AuthResponseDTO {

    private String token;
    private String email;
    private String role;

    // ✅ Default constructor
    public AuthResponseDTO() {}

    // ✅ All-args constructor
    public AuthResponseDTO(String token, String email, String role) {
        this.token = token;
        this.email = email;
        this.role = role;
    }

    // ✅ Getters
    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    // (Optional but useful)
    public void setToken(String token) {
        this.token = token;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }
}