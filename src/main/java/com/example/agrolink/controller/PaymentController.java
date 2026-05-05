package com.example.agrolink.controller;

import com.example.agrolink.service.PaymentService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequestMapping("/payment")
@PreAuthorize("hasRole('BUYER')")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ================== CHECKOUT ==================

    @GetMapping("/checkout/{orderId}")
    public String checkout(@PathVariable Long orderId, Principal principal) {

        if (principal == null) {
            return "redirect:/auth/login";
        }

        String email = normalizeEmail(principal.getName());
        logger.info("Payment attempt for order {} by {}", orderId, email);

        try {
            String checkoutUrl = paymentService.createCheckoutSession(orderId, email);

            if (checkoutUrl == null || checkoutUrl.isBlank()) {
                logger.error("Checkout URL is null");
                return "redirect:/orders/my?error=true";
            }

            return "redirect:" + checkoutUrl;

        } catch (Exception ex) {
            logger.warn("Checkout failed: {}", ex.getMessage());
            return "redirect:/orders/my?error=true";
        }
    }

    // ================== SUCCESS ==================

    @GetMapping("/success")
    public String success() {
        return "payment-success";
    }

    // ================== CANCEL ==================

    @GetMapping("/cancel")
    public String cancel() {
        return "payment-cancel";
    }

    // ================== HELPERS ==================

    private String normalizeEmail(String email) {
        return email == null ? "" : email.toLowerCase().trim();
    }
}