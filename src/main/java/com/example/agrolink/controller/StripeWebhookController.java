package com.example.agrolink.controller;

import com.example.agrolink.service.OrderService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class StripeWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(StripeWebhookController.class);

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

        Event event = constructEvent(payload, sigHeader);
        if (event == null) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        logger.info("Stripe event received: {}", event.getType());

        try {
            switch (event.getType()) {

                case "checkout.session.completed" -> handleCheckoutCompleted(event);

                default -> logger.debug("Unhandled event type: {}", event.getType());
            }

        } catch (Exception ex) {
            logger.error("Webhook processing failed", ex);
            return ResponseEntity.internalServerError().body("Webhook error");
        }

        return ResponseEntity.ok("Success");
    }

    // ================== EVENT HANDLERS ==================

    private void handleCheckoutCompleted(Event event) {

        var obj = event.getDataObjectDeserializer().getObject();

        if (obj.isEmpty() || !(obj.get() instanceof Session session)) {
            logger.warn("Invalid session object in webhook");
            return;
        }

        if (session.getMetadata() == null) {
            logger.warn("Session metadata missing");
            return;
        }

        String orderIdStr = session.getMetadata().get("orderId");

        if (orderIdStr == null) {
            logger.warn("Order ID missing in metadata");
            return;
        }

        try {
            Long orderId = Long.parseLong(orderIdStr);

            logger.info("Processing payment for order {}", orderId);

            // 🔐 Idempotent safe call
            orderService.markAsPaid(orderId);

        } catch (NumberFormatException ex) {
            logger.error("Invalid orderId format: {}", orderIdStr);
        }
    }

    // ================== HELPERS ==================

    private Event constructEvent(String payload, String sigHeader) {
        try {
            return Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception ex) {
            logger.warn("Invalid Stripe signature");
            return null;
        }
    }
}