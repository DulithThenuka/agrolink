package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.*;
import com.example.agrolink.service.PaymentService;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@PreAuthorize("hasRole('BUYER')")
public class RestPaymentController {

    private static final Logger logger = LoggerFactory.getLogger(RestPaymentController.class);

    private final PaymentService paymentService;

    public RestPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout/{orderId}")
    public ApiResponse<Map<String, String>> createCheckoutSession(@PathVariable Long orderId, Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }

        String email = principal.getName().toLowerCase().trim();
        logger.info("REST Payment checkout request for order {} by {}", orderId, email);

        try {
            String checkoutUrl = paymentService.createCheckoutSession(orderId, email);
            if (checkoutUrl == null || checkoutUrl.isBlank()) {
                throw new IllegalStateException("Failed to generate checkout session");
            }
            return ApiResponse.success("Checkout session created", Map.of("checkoutUrl", checkoutUrl));
        } catch (Exception ex) {
            logger.error("REST Checkout failed: {}", ex.getMessage());
            throw new IllegalArgumentException(ex.getMessage());
        }
    }
}
