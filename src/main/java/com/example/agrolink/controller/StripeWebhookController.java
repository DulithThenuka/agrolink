package com.example.agrolink.controller;

import com.example.agrolink.entity.Order;
import com.example.agrolink.service.OrderService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    private final OrderService orderService;

    public StripeWebhookController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        // 🔥 Handle event
        if ("checkout.session.completed".equals(event.getType())) {

            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElse(null);

            if (session != null) {

                String orderIdStr = session.getMetadata().get("orderId");

                if (orderIdStr != null) {
                    Long orderId = Long.parseLong(orderIdStr);

                    // ✅ mark as paid
                    orderService.markAsPaid(orderId);
                }
            }
        }

        return ResponseEntity.ok("Success");
    }
}