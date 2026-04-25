package com.example.agrolink.entity;

public enum Role {

    FARMER("Farmer"),
    BUYER("Buyer"),
    ADMIN("Admin");

    private final String label;

    Role(String label) {
        this.label = label;
    }

    // ✅ For Spring Security
    public String getAuthority() {
        return "ROLE_" + this.name();
    }

    // ✅ For UI display
    public String getLabel() {
        return label;
    }

    // ✅ Role checks
    public boolean isAdmin() {
        return this == ADMIN;
    }

    public boolean isFarmer() {
        return this == FARMER;
    }

    public boolean isBuyer() {
        return this == BUYER;
    }
}