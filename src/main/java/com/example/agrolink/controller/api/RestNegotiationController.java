package com.example.agrolink.controller.api;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.NegotiationDTO;
import com.example.agrolink.service.NegotiationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/negotiation")
public class RestNegotiationController {

    private final NegotiationService negotiationService;

    public RestNegotiationController(NegotiationService negotiationService) {
        this.negotiationService = negotiationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<NegotiationDTO>> getNegotiation(@RequestParam(value = "accepted", required = false, defaultValue = "false") boolean accepted) {
        NegotiationDTO data = negotiationService.getActiveNegotiation(accepted);
        return ResponseEntity.ok(ApiResponse.success("Negotiation thread retrieved successfully", data));
    }

    @PostMapping("/accept")
    public ResponseEntity<ApiResponse<NegotiationDTO>> acceptOffer() {
        NegotiationDTO data = negotiationService.getActiveNegotiation(true);
        return ResponseEntity.ok(ApiResponse.success("Offer accepted & B2B contract created!", data));
    }
}
