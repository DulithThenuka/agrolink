package com.example.agrolink.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserRegisterDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100,
          message = "Password must be between 6 and 100 characters")
    private String password;

    @Size(max = 100,
          message = "Location must be less than 100 characters")
    private String location;

    // ================== CONSTRUCTORS ==================

    public UserRegisterDTO() {
    }

    // ================== NORMALIZATION ==================

    public void normalize() {

        if (name != null) {
            name = name.trim();
        }

        if (email != null) {
            email = email.toLowerCase().trim();
        }

        if (password != null) {
            password = password.trim();
        }

        if (location != null) {
            location = location.trim();
        }
    }

    // ================== GETTERS & SETTERS ==================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null
                ? null
                : name.trim();
    }

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location == null
                ? null
                : location.trim();
    }
}