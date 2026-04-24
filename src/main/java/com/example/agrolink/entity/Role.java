package com.example.agrolink.entity;

public enum Role {
    FARMER,
    BUYER,
    ADMIN;

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}