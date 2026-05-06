package com.example.agrolink.entity;

import java.util.EnumSet;

public enum OrderStatus {

    PENDING("Pending"),
    CONFIRMED("Confirmed"),
    SHIPPED("Shipped"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled");

    private final String label;

    OrderStatus(String label) {
        this.label = label;
    }

    // ================== GETTERS ==================

    public String getLabel() {
        return label;
    }

    // ================== STATE CHECKS ==================

    public boolean isFinal() {
        return this == DELIVERED ||
               this == CANCELLED;
    }

    public boolean isEditable() {
        return this == PENDING ||
               this == CONFIRMED;
    }

    // ================== TRANSITIONS ==================

    public boolean canTransitionTo(OrderStatus next) {

        if (next == null) {
            return false;
        }

        switch (this) {

            case PENDING:
                return EnumSet.of(
                        CONFIRMED,
                        CANCELLED
                ).contains(next);

            case CONFIRMED:
                return EnumSet.of(
                        SHIPPED,
                        CANCELLED
                ).contains(next);

            case SHIPPED:
                return next == DELIVERED;

            case DELIVERED:
            case CANCELLED:
                return false;

            default:
                return false;
        }
    }

    public void validateTransition(OrderStatus next) {

        if (!canTransitionTo(next)) {

            throw new IllegalStateException(
                    "Invalid status transition: "
                            + this
                            + " → "
                            + next
            );
        }
    }
}