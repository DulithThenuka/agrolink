package com.example.agrolink.entity;

import java.util.EnumSet;
import java.util.Set;

public enum Role {

    FARMER("Farmer / Harvest Grower"),
    BUYER("Retail Buyer / Consumer"),
    BUSINESS_BUYER("Commercial Business Buyer (B2B)"),
    LOGISTICS("Logistics Provider"),
    LOGISTICS_PROVIDER("Logistics Provider & Fleet Operator"),
    EXPERT("Agricultural Expert"),
    AGRICULTURAL_EXPERT("Agronomist & Agricultural Specialist"),
    SUPPLIER("Agricultural Input Supplier"),
    ADMIN("System Admin & Policy Officer");

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
        return this == role || (this == LOGISTICS_PROVIDER && role == LOGISTICS)
                            || (this == LOGISTICS && role == LOGISTICS_PROVIDER)
                            || (this == AGRICULTURAL_EXPERT && role == EXPERT)
                            || (this == EXPERT && role == AGRICULTURAL_EXPERT);
    }

    public boolean hasAccessTo(Role requiredRole) {
        return getAccessibleRoles().contains(requiredRole);
    }

    private Set<Role> getAccessibleRoles() {
        switch (this) {
            case ADMIN:
                return EnumSet.allOf(Role.class);
            case FARMER:
                return EnumSet.of(FARMER);
            case BUYER:
                return EnumSet.of(BUYER);
            case BUSINESS_BUYER:
                return EnumSet.of(BUSINESS_BUYER, BUYER);
            case LOGISTICS:
            case LOGISTICS_PROVIDER:
                return EnumSet.of(LOGISTICS, LOGISTICS_PROVIDER);
            case EXPERT:
            case AGRICULTURAL_EXPERT:
                return EnumSet.of(EXPERT, AGRICULTURAL_EXPERT);
            case SUPPLIER:
                return EnumSet.of(SUPPLIER);
            default:
                return EnumSet.noneOf(Role.class);
        }
    }
}