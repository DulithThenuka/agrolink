package com.example.agrolink.service;

import com.example.agrolink.entity.Order;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${stripe.secret.key}")
    private String stripeKey;

    @Value("${app.base.url}")
    private String baseUrl;

    public String createCheckoutSession(Order order) {

        Stripe.apiKey = stripeKey;

        // ✅ Convert to cents safely
        long amount = order.getTotalPrice()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)

                        // ❗ NO orderId here
                        .setSuccessUrl(baseUrl + "/payment/success")
                        .setCancelUrl(baseUrl + "/payment/cancel")

                        // 🔐 IMPORTANT: metadata for webhook
                        .putMetadata("orderId", order.getId().toString())

                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity((long) order.getQuantity())
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(amount)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName(order.getCrop().getName())
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

        try {
            Session session = Session.create(params);

            logger.info("Stripe session created for order {}", order.getId());

            return session.getUrl();

        } catch (Exception e) {
            logger.error("Stripe session creation failed for order {}", order.getId(), e);
            throw new IllegalStateException("Stripe session creation failed", e);
        }
    }
}