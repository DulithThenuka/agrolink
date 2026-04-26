package com.example.agrolink.controller;

import com.example.agrolink.entity.Order;
import com.example.agrolink.service.OrderService;
import com.example.agrolink.service.PaymentService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequestMapping("/payment")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService,
                             OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    // 🔥 Create Stripe session
    @PreAuthorize("hasRole('BUYER')")
    @GetMapping("/checkout/{orderId}")
    public String checkout(@PathVariable Long orderId, Principal principal) {

        String email = principal.getName();

        logger.info("Payment attempt for order {} by {}", orderId, email);

        Order order = orderService.getOrderById(orderId);

        // 🔐 Ownership validation
        if (!order.getBuyer().getEmail().equals(email)) {
            throw new IllegalArgumentException("Unauthorized access");
        }

        String url = paymentService.createCheckoutSession(order);

        return "redirect:" + url;
    }

    // ✅ Success page ONLY (no logic)
    @GetMapping("/success")
    public String success() {
        return "payment-success";
    }

    // ❌ Cancel
    @GetMapping("/cancel")
    public String cancel() {
        return "payment-cancel";
    }
}