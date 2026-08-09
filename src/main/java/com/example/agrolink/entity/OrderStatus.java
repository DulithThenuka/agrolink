package com.example.agrolink.entity;

import java.util.EnumSet;

public enum OrderStatus {

    PENDING("Pending"),
    FARMER_ACCEPTED("Farmer Accepted"),
    TRANSPORT_REQUESTED("Transport Requested"),
    DRIVER_ASSIGNED("Driver Assigned"),
    COLLECTED("Crop Collected"),
    IN_TRANSIT("In Transit"),
    DELIVERED("Delivered"),
    CONFIRMED("Buyer Confirmed"),
    PAID("Farmer Paid"),
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
        return this == PAID ||
               this == CANCELLED;
    }

    public boolean isEditable() {
        return this == PENDING ||
               this == FARMER_ACCEPTED ||
               this == TRANSPORT_REQUESTED;
    }

    // ================== TRANSITIONS ==================

    public boolean canTransitionTo(OrderStatus next) {

        if (next == null) {
            return false;
        }

        switch (this) {

            case PENDING:
                return EnumSet.of(
                        FARMER_ACCEPTED,
                        TRANSPORT_REQUESTED,
                        CONFIRMED,
                        CANCELLED
                ).contains(next);

            case FARMER_ACCEPTED:
                return EnumSet.of(
                        TRANSPORT_REQUESTED,
                        DRIVER_ASSIGNED,
                        CANCELLED
                ).contains(next);

            case TRANSPORT_REQUESTED:
                return EnumSet.of(
                        DRIVER_ASSIGNED,
                        CANCELLED
                ).contains(next);

            case DRIVER_ASSIGNED:
                return EnumSet.of(
                        COLLECTED,
                        CANCELLED
                ).contains(next);

            case COLLECTED:
                return EnumSet.of(
                        IN_TRANSIT,
                        DELIVERED
                ).contains(next);

            case IN_TRANSIT:
                return EnumSet.of(
                        DELIVERED
                ).contains(next);

            case DELIVERED:
                return EnumSet.of(
                        CONFIRMED,
                        PAID
                ).contains(next);

            case CONFIRMED:
                return EnumSet.of(
                        PAID
                ).contains(next);

            case PAID:
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