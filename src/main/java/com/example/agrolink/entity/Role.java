package com.example.agrolink.entity;

public enum Role {

    FARMER("Farmer"),
    BUYER("Buyer"),
    ADMIN("Admin");

    private static final String ROLE_PREFIX = "ROLE_";

    private final String label;

    Role(String label) {
        this.label = label;
    }

    // ================== SECURITY ==================

    public String getAuthority() {
        return ROLE_PREFIX + this.name();
    }

    // ================== UI ==================

    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return label;
    }

    // ================== LOGIC ==================

    public boolean is(Role role) {
        return this == role;
    }

    public boolean hasAccessTo(Role role) {
        if (this == ADMIN) return true;
        return this == role;
    }
}