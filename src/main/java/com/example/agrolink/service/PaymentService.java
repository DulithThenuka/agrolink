package com.example.agrolink.service;

import com.example.agrolink.entity.Order;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private static final String CURRENCY = "usd";

    @Value("${stripe.secret.key}")
    private String stripeKey;

    @Value("${app.base.url}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeKey;
    }

    public String createCheckoutSession(Order order) {

        validateOrder(order);

        long amountInCents = convertToCents(order.getTotalPrice());

        SessionCreateParams params = buildSessionParams(order, amountInCents);

        try {
            Session session = Session.create(params);

            logger.info("Stripe session created: orderId={}, sessionId={}",
                    order.getId(), session.getId());

            return session.getUrl();

        } catch (StripeException ex) {
            logger.error("Stripe API error for order {}", order.getId(), ex);
            throw new IllegalStateException("Payment gateway error", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error during Stripe session creation for order {}", order.getId(), ex);
            throw new IllegalStateException("Payment session creation failed", ex);
        }
    }

    // ================== HELPERS ==================

    private void validateOrder(Order order) {
        if (order == null || order.getId() == null) {
            throw new IllegalArgumentException("Invalid order");
        }

        if (order.getTotalPrice() == null || order.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid order amount");
        }

        if (order.getCrop() == null || order.getCrop().getName() == null) {
            throw new IllegalArgumentException("Invalid crop data");
        }
    }

    private long convertToCents(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();
    }

    private SessionCreateParams buildSessionParams(Order order, long amount) {

        return SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)

                // URLs
                .setSuccessUrl(buildSuccessUrl())
                .setCancelUrl(buildCancelUrl())

                // Metadata for webhook
                .putMetadata("orderId", order.getId().toString())

                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity((long) order.getQuantity())
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(CURRENCY)
                                                .setUnitAmount(amount)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(safe(order.getCrop().getName()))
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();
    }

    private String buildSuccessUrl() {
        return baseUrl + "/payment/success";
    }

    private String buildCancelUrl() {
        return baseUrl + "/payment/cancel";
    }

    private String safe(String value) {
        return Objects.requireNonNullElse(value, "Product");
    }

    public String createCheckoutSession(Long orderId, String email) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createCheckoutSession'");
    }
}