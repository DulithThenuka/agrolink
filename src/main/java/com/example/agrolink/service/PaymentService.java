package com.example.agrolink.service;

import com.example.agrolink.entity.Order;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeKey;

    @Value("${app.base.url}")
    private String baseUrl;

    public String createCheckoutSession(Order order) {

        Stripe.apiKey = stripeKey;

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)

                        .setSuccessUrl(baseUrl + "/payment/success?orderId=" + order.getId())
                        .setCancelUrl(baseUrl + "/payment/cancel")

                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity((long) order.getQuantity())
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(
                                                                order.getTotalPrice()
                                                                        .multiply(java.math.BigDecimal.valueOf(100))
                                                                        .longValue()
                                                        )
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
            return session.getUrl(); // 🔥 redirect user here
        } catch (Exception e) {
            throw new RuntimeException("Stripe session creation failed");
        }
    }
    SessionCreateParams params =
    SessionCreateParams.builder()
        .setMode(SessionCreateParams.Mode.PAYMENT)

        .setSuccessUrl(baseUrl + "/payment/success")
        .setCancelUrl(baseUrl + "/payment/cancel")

        .putMetadata("orderId", order.getId().toString()) // 🔥 ADD THIS

        .addLineItem(...)
        .build();
}