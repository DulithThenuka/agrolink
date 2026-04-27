package com.example.agrolink.entity;

import java.util.EnumSet;
import java.util.Set;

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

    public boolean hasAccessTo(Role requiredRole) {
        return getAccessibleRoles().contains(requiredRole);
    }

    private Set<Role> getAccessibleRoles() {
        return switch (this) {
            case ADMIN -> EnumSet.allOf(Role.class);
            case FARMER -> EnumSet.of(FARMER);
            case BUYER -> EnumSet.of(BUYER);
        };
    }
}