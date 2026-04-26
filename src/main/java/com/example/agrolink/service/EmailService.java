package com.example.agrolink.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOrderConfirmation(String toEmail,
                                      String cropName,
                                      int quantity,
                                      BigDecimal totalPrice) {

        if (toEmail == null || toEmail.isBlank()) {
            logger.warn("Email not sent: invalid recipient");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(toEmail);
            message.setSubject("AgroLink Order Confirmation 🌾");
            message.setFrom(fromEmail);

            message.setText(buildOrderMessage(cropName, quantity, totalPrice));

            mailSender.send(message);

            logger.info("Order confirmation email sent to {}", toEmail);

        } catch (Exception e) {
            logger.error("Failed to send email to {}", toEmail, e);
        }
    }

    private String buildOrderMessage(String cropName,
                                     int quantity,
                                     BigDecimal totalPrice) {

        BigDecimal formattedPrice = totalPrice.setScale(2, RoundingMode.HALF_UP);

        return """
                Your order has been placed successfully!

                Crop: %s
                Quantity: %d
                Total Price: %s

                Thank you for using AgroLink!
                """.formatted(cropName, quantity, formattedPrice);
    }
}