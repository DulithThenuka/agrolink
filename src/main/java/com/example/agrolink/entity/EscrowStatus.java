package com.example.agrolink.entity;

public enum EscrowStatus {

    HELD_IN_ESCROW("Held in Escrow"),
    RELEASED_TO_FARMER("Released to Farmer"),
    DISPUTED("Under Dispute"),
    REFUNDED_TO_BUYER("Refunded to Buyer");

    private final String label;

    EscrowStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
