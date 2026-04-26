package com.example.agrolink.entity;

import java.util.Set;

public enum PaymentStatus {

    PENDING("Pending"),
    SUCCESS("Success"),
    FAILED("Failed"),
    CANCELLED("Cancelled");

    private final String label;

    PaymentStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    // ================== STATE ==================

    public boolean isFinal() {
        return this == SUCCESS || this == FAILED || this == CANCELLED;
    }

    public boolean canRetry() {
        return this == FAILED || this == CANCELLED;
    }

    // ================== TRANSITIONS ==================

    public boolean canTransitionTo(PaymentStatus next) {

        if (next == null) return false;

        return switch (this) {
            case PENDING -> Set.of(SUCCESS, FAILED, CANCELLED).contains(next);
            case FAILED -> next == PENDING; // retry
            case CANCELLED -> false;
            case SUCCESS -> false;
        };
    }

    // ================== VALIDATION ==================

    public void validateTransition(PaymentStatus next) {
        if (!canTransitionTo(next)) {
            throw new IllegalStateException(
                "Invalid payment status transition from " + this + " to " + next
            );
        }
    }
}