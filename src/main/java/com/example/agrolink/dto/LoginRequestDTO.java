package com.example.agrolink.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequestDTO {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100,
          message = "Password must be between 6 and 100 characters")
    private String password;

    // ================== CONSTRUCTORS ==================

    public LoginRequestDTO() {
    }

    // ================== NORMALIZATION ==================

    public void normalize() {

        if (email != null) {
            email = email.toLowerCase().trim();
        }

        if (password != null) {
            password = password.trim();
        }
    }

    // ================== GETTERS & SETTERS ==================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null
                ? null
                : email.toLowerCase().trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null
                ? null
                : password.trim();
    }
}