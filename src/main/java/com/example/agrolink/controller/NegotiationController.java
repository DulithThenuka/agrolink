package com.example.agrolink.controller;

import com.example.agrolink.dto.NegotiationDTO;
import com.example.agrolink.service.NegotiationService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/negotiation")
public class NegotiationController {

    private final NegotiationService negotiationService;

    public NegotiationController(NegotiationService negotiationService) {
        this.negotiationService = negotiationService;
    }

    @GetMapping
    public String negotiationRoom(@RequestParam(value = "accepted", required = false, defaultValue = "false") boolean accepted, Model model) {
        NegotiationDTO negotiation = negotiationService.getActiveNegotiation(accepted);
        model.addAttribute("negotiation", negotiation);
        return "pages/negotiation/negotiation";
    }

    @PostMapping("/accept")
    public String acceptOffer(Model model) {
        NegotiationDTO negotiation = negotiationService.getActiveNegotiation(true);
        model.addAttribute("negotiation", negotiation);
        return "pages/negotiation/negotiation";
    }
}
