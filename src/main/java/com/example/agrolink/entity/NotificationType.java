package com.example.agrolink.entity;

public enum NotificationType {

    // ================== ORDER EVENTS ==================
    ORDER_PLACED,
    ORDER_CONFIRMED,
    ORDER_CANCELLED,

    // ================== PAYMENT ==================
    PAYMENT_SUCCESS,
    PAYMENT_FAILED,

    // ================== CROP EVENTS ==================
    CROP_CREATED,
    CROP_UPDATED,
    CROP_DELETED,

    // ================== USER EVENTS ==================
    USER_REGISTERED,
    USER_LOGIN
}