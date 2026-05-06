package com.example.agrolink.entity;

import java.util.EnumSet;

public enum PaymentStatus {

    PENDING("Pending"),
    SUCCESS("Success"),
    FAILED("Failed"),
    CANCELLED("Cancelled");

    private final String label;

    PaymentStatus(String label) {
        this.label = label;
    }

    // ================== GETTERS ==================

    public String getLabel() {
        return label;
    }

    // ================== STATE ==================

    public boolean isFinal() {

        return this == SUCCESS ||
               this == FAILED ||
               this == CANCELLED;
    }

    public boolean canRetry() {

        return this == FAILED ||
               this == CANCELLED;
    }

    // ================== TRANSITIONS ==================

    public boolean canTransitionTo(PaymentStatus next) {

        if (next == null) {
            return false;
        }

        switch (this) {

            case PENDING:
                return EnumSet.of(
                        SUCCESS,
                        FAILED,
                        CANCELLED
                ).contains(next);

            case FAILED:
                return next == PENDING;

            case CANCELLED:
                return false;

            case SUCCESS:
                return false;

            default:
                return false;
        }
    }

    public void validateTransition(PaymentStatus next) {

        if (!canTransitionTo(next)) {

            throw new IllegalStateException(
                    "Invalid payment transition: "
                            + this
                            + " → "
                            + next
            );
        }
    }
}