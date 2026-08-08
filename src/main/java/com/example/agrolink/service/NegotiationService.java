package com.example.agrolink.service;

import com.example.agrolink.dto.NegotiationDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class NegotiationService {

    public NegotiationDTO getActiveNegotiation(boolean contractAccepted) {
        List<NegotiationDTO.ChatMessage> messages = new ArrayList<>();
        messages.add(new NegotiationDTO.ChatMessage("BUYER", "I need 500kg tomatoes every week.", "10:30 AM"));
        messages.add(new NegotiationDTO.ChatMessage("FARMER", "I can supply 350kg this week and 500kg starting next week.", "10:32 AM"));
        messages.add(new NegotiationDTO.ChatMessage("BUYER", "Rs. 190/kg?", "10:34 AM"));
        messages.add(new NegotiationDTO.ChatMessage("FARMER", "Rs. 200/kg including delivery.", "10:35 AM"));

        String status = contractAccepted ? "CONTRACT_CREATED" : "NEGOTIATING";
        String contractId = contractAccepted ? "#AGRO-B2B-8924" : null;

        return new NegotiationDTO(
            "NEG-9921",
            "Tomato (Grade A)",
            "Colombo Wholesale Market",
            "Nuwara Eliya Organic Farm",
            new BigDecimal("200.00"),
            500,
            status,
            contractId,
            messages
        );
    }
}
