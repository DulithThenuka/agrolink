package com.example.agrolink.entity;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    public boolean isFinal() {
        return this == DELIVERED || this == CANCELLED;
    }
}