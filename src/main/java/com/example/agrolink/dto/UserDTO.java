package com.example.agrolink.dto;

public class UserDTO {

    private final Long id;
    private final String name;
    private final String email;
    private final String role;
    private final String location;

    public UserDTO(Long id,
                   String name,
                   String email,
                   String role,
                   String location) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getLocation() {
        return location;
    }
}