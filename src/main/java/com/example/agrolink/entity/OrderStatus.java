package com.example.agrolink.entity;

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

    // ✅ Final states
    public boolean isFinal() {
        return this == DELIVERED || this == CANCELLED;
    }

    // ✅ Can order be modified?
    public boolean isEditable() {
        return this == PENDING || this == CONFIRMED;
    }

    // ✅ Allowed transitions
    public boolean canTransitionTo(OrderStatus next) {

        return switch (this) {
            case PENDING -> next == CONFIRMED || next == CANCELLED;
            case CONFIRMED -> next == SHIPPED || next == CANCELLED;
            case SHIPPED -> next == DELIVERED;
            default -> false;
        };
    }
}