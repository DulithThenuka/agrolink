package com.example.agrolink.service;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async // ✅ send email in background
    public void sendOrderConfirmation(String toEmail,
                                      String cropName,
                                      int quantity,
                                      BigDecimal totalPrice) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(toEmail);
            message.setSubject("AgroLink Order Confirmation 🌾");
            message.setFrom("no-reply@agrolink.com"); // ✅ important

            message.setText(buildOrderMessage(cropName, quantity, totalPrice));

            mailSender.send(message);

            logger.info("Order confirmation email sent to {}", toEmail);

        } catch (Exception e) {
            logger.error("Failed to send email to {}", toEmail, e);
        }
    }

    // ✅ Separate message builder
    private String buildOrderMessage(String cropName,
                                     int quantity,
                                     BigDecimal totalPrice) {

        return """
                Your order has been placed successfully!

                Crop: %s
                Quantity: %d
                Total Price: %s

                Thank you for using AgroLink!
                """.formatted(cropName, quantity, totalPrice);
    }
}