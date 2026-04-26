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

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            logger.error("Invalid Stripe signature", e);
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        logger.info("Stripe event received: {}", event.getType());

        if ("checkout.session.completed".equals(event.getType())) {

            var obj = event.getDataObjectDeserializer().getObject();

            if (obj.isPresent() && obj.get() instanceof Session session) {

                if (session.getMetadata() != null) {

                    String orderIdStr = session.getMetadata().get("orderId");

                    if (orderIdStr != null) {
                        try {
                            Long orderId = Long.parseLong(orderIdStr);

                            logger.info("Processing payment for order {}", orderId);

                            orderService.markAsPaid(orderId);

                        } catch (NumberFormatException e) {
                            logger.error("Invalid orderId in metadata: {}", orderIdStr);
                        }
                    }
                }
            }
        }

        return ResponseEntity.ok("Success");
    }
}