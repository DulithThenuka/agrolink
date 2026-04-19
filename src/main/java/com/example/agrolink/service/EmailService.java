package com.example.agrolink.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmation(String toEmail,
                                      String cropName,
                                      int quantity,
                                      double totalPrice) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("AgroLink Order Confirmation 🌾");

        message.setText(
                "Your order has been placed successfully!\n\n" +
                "Crop: " + cropName + "\n" +
                "Quantity: " + quantity + "\n" +
                "Total Price: " + totalPrice + "\n\n" +
                "Thank you for using AgroLink!"
        );

        mailSender.send(message);
    }
}