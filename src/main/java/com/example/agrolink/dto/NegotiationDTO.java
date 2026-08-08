package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class NegotiationDTO {

    private final String id;
    private final String cropName;
    private final String buyerName;
    private final String farmerName;
    private final BigDecimal currentOfferedPriceLkr;
    private final int currentOfferedQuantityKg;
    private final String status; // NEGOTIATING, CONTRACT_CREATED, REJECTED
    private final String contractId;
    private final List<ChatMessage> messages;

    public NegotiationDTO(String id,
                          String cropName,
                          String buyerName,
                          String farmerName,
                          BigDecimal currentOfferedPriceLkr,
                          int currentOfferedQuantityKg,
                          String status,
                          String contractId,
                          List<ChatMessage> messages) {
        this.id = id;
        this.cropName = cropName;
        this.buyerName = buyerName;
        this.farmerName = farmerName;
        this.currentOfferedPriceLkr = currentOfferedPriceLkr;
        this.currentOfferedQuantityKg = currentOfferedQuantityKg;
        this.status = status;
        this.contractId = contractId;
        this.messages = messages != null ? List.copyOf(messages) : List.of();
    }

    public String getId() { return id; }
    public String getCropName() { return cropName; }
    public String getBuyerName() { return buyerName; }
    public String getFarmerName() { return farmerName; }
    public BigDecimal getCurrentOfferedPriceLkr() { return currentOfferedPriceLkr; }
    public int getCurrentOfferedQuantityKg() { return currentOfferedQuantityKg; }
    public String getStatus() { return status; }
    public String getContractId() { return contractId; }
    public List<ChatMessage> getMessages() { return messages; }

    public static final class ChatMessage {
        private final String senderRole; // BUYER or FARMER
        private final String text;
        private final String timestampText;

        public ChatMessage(String senderRole, String text, String timestampText) {
            this.senderRole = senderRole;
            this.text = text;
            this.timestampText = timestampText;
        }

        public String getSenderRole() { return senderRole; }
        public String getText() { return text; }
        public String getTimestampText() { return timestampText; }
    }
}
