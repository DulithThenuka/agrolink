package com.example.agrolink.entity;

import java.util.Set;

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

    public String getLabel() {
        return label;
    }

    // ================== STATE CHECKS ==================

    public boolean isFinal() {
        return this == DELIVERED || this == CANCELLED;
    }

    public boolean isEditable() {
        return this == PENDING || this == CONFIRMED;
    }

    // ================== TRANSITIONS ==================

    public boolean canTransitionTo(OrderStatus next) {

        if (next == null) return false;

        return switch (this) {
            case PENDING -> Set.of(CONFIRMED, CANCELLED).contains(next);
            case CONFIRMED -> Set.of(SHIPPED, CANCELLED).contains(next);
            case SHIPPED -> next == DELIVERED;
            case DELIVERED, CANCELLED -> false; // final states
        };
    }

    // ================== VALIDATION ==================

    public void validateTransition(OrderStatus next) {
        if (!canTransitionTo(next)) {
            throw new IllegalStateException(
                "Cannot transition from " + this + " to " + next
            );
        }
    }
}