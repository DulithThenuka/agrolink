package com.example.agrolink.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.agrolink.dto.NotificationDTO;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final Map<String, Boolean> readStateMap = new HashMap<>();

    public List<NotificationDTO> getUserNotifications(String userEmail) {
        logger.info("Fetching notifications for user {}", userEmail);

        String timeNow = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
        String timeAgo1 = LocalDateTime.now().minusMinutes(12).format(DateTimeFormatter.ofPattern("HH:mm"));
        String timeAgo2 = LocalDateTime.now().minusHours(2).format(DateTimeFormatter.ofPattern("HH:mm"));

        List<NotificationDTO> notifications = List.of(
                new NotificationDTO(
                        "NOTIF-01",
                        "🚚 Order Dispatched!",
                        "Vehicle WP LK-4892 has picked up your 150kg Samba Rice batch from Nuwara Eliya.",
                        "LOGISTICS_DISPATCH",
                        readStateMap.getOrDefault("NOTIF-01", false),
                        timeNow
                ),
                new NotificationDTO(
                        "NOTIF-02",
                        "🔒 Escrow Payment Secured",
                        "Payment of Rs 34,500.00 is safely held in AgroLink Escrow vault pending delivery confirmation.",
                        "ESCROW_RELEASE",
                        readStateMap.getOrDefault("NOTIF-02", false),
                        timeAgo1
                ),
                new NotificationDTO(
                        "NOTIF-03",
                        "♻️ Waste Rescue Recommendation",
                        "AgroLink detected 500kg Tomatoes near 2-day expiry. 15% flash price cut recommended.",
                        "WASTE_ALERT",
                        readStateMap.getOrDefault("NOTIF-03", true),
                        timeAgo2
                ),
                new NotificationDTO(
                        "NOTIF-04",
                        "⭐ New Customer Review",
                        "Restaurant A posted a 5-star review: 'Outstanding fresh harvest quality!'",
                        "SYSTEM",
                        readStateMap.getOrDefault("NOTIF-04", true),
                        "Yesterday"
                )
        );

        return notifications;
    }

    public void markAsRead(String notificationId) {
        logger.info("Marking notification {} as read", notificationId);
        readStateMap.put(notificationId, true);
    }
}
