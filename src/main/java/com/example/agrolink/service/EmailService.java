package com.example.agrolink.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailService.class);

    private static final String SUBJECT_ORDER_CONFIRMATION =
            "AgroLink Order Confirmation 🌾";

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile(
                    "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
            );

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(
            JavaMailSender mailSender) {

        this.mailSender = mailSender;
    }

    // ================== SEND EMAIL ==================

    @Async
    public void sendOrderConfirmation(
            String toEmail,
            String cropName,
            int quantity,
            BigDecimal totalPrice) {

        if (!isValidEmail(toEmail)) {

            logger.warn(
                    "Email not sent: invalid recipient [{}]",
                    toEmail
            );

            return;
        }

        try {

            SimpleMailMessage message =
                    buildMessage(
                            toEmail,
                            SUBJECT_ORDER_CONFIRMATION,
                            buildOrderMessage(
                                    cropName,
                                    quantity,
                                    totalPrice
                            )
                    );

            mailSender.send(message);

            logger.info(
                    "Order confirmation email sent to {}",
                    toEmail
            );

        } catch (MailException ex) {

            logger.error(
                    "Mail server error while sending to {}",
                    toEmail,
                    ex
            );

        } catch (Exception ex) {

            logger.error(
                    "Unexpected error while sending email to {}",
                    toEmail,
                    ex
            );
        }
    }

    // ================== HELPERS ==================

    private SimpleMailMessage buildMessage(
            String to,
            String subject,
            String body) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(subject);

        message.setFrom(
                safeFromEmail()
        );

        message.setText(body);

        return message;
    }

    private String buildOrderMessage(
            String cropName,
            int quantity,
            BigDecimal totalPrice) {

        BigDecimal formattedPrice =
                formatPrice(totalPrice);

        return """
                Your order has been placed successfully!

                Crop: %s
                Quantity: %d
                Total Price: %s

                Thank you for using AgroLink!
                """
                .formatted(
                        safe(cropName),
                        quantity,
                        formattedPrice
                );
    }

    private BigDecimal formatPrice(
            BigDecimal price) {

        return price == null
                ? BigDecimal.ZERO.setScale(
                        2,
                        RoundingMode.HALF_UP
                )
                : price.setScale(
                        2,
                        RoundingMode.HALF_UP
                );
    }

    private boolean isValidEmail(
            String email) {

        return email != null
                && !email.isBlank()
                && EMAIL_PATTERN
                        .matcher(email)
                        .matches();
    }

    private String safe(
            String value) {

        return Objects.requireNonNullElse(
                value,
                "N/A"
        );
    }

    private String safeFromEmail() {

        return (fromEmail == null
                || fromEmail.isBlank())
                ? "noreply@agrolink.com"
                : fromEmail;
    }
}