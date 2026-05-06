package com.example.agrolink.entity;

public enum NotificationType {

    // ================== ORDER EVENTS ==================

    ORDER_PLACED("Order Placed"),
    ORDER_CONFIRMED("Order Confirmed"),
    ORDER_CANCELLED("Order Cancelled"),

    // ================== PAYMENT EVENTS ==================

    PAYMENT_SUCCESS("Payment Successful"),
    PAYMENT_FAILED("Payment Failed"),

    // ================== CROP EVENTS ==================

    CROP_CREATED("Crop Created"),
    CROP_UPDATED("Crop Updated"),
    CROP_DELETED("Crop Deleted"),

    // ================== USER EVENTS ==================

    USER_REGISTERED("User Registered"),
    USER_LOGIN("User Login");

    private final String label;

    NotificationType(String label) {
        this.label = label;
    }

    // ================== GETTERS ==================

    public String getLabel() {
        return label;
    }

    // ================== HELPERS ==================

    public boolean isPaymentEvent() {
        return this == PAYMENT_SUCCESS ||
               this == PAYMENT_FAILED;
    }

    public boolean isOrderEvent() {
        return this == ORDER_PLACED ||
               this == ORDER_CONFIRMED ||
               this == ORDER_CANCELLED;
    }

    public boolean isCropEvent() {
        return this == CROP_CREATED ||
               this == CROP_UPDATED ||
               this == CROP_DELETED;
    }

    public boolean isUserEvent() {
        return this == USER_REGISTERED ||
               this == USER_LOGIN;
    }
}