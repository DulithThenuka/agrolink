package com.example.agrolink.dto;

import com.example.agrolink.entity.Role;

public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String location;

    // NO password here ❗

    public UserDTO() {}

    public UserDTO(Long id, String name, String email, Role role, String location) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.location = location;
    }

    // getters & setters
}