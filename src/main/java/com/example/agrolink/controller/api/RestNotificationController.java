package com.example.agrolink.controller.api;

import java.security.Principal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.NotificationDTO;
import com.example.agrolink.service.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
public class RestNotificationController {

    private static final Logger logger = LoggerFactory.getLogger(RestNotificationController.class);

    private final NotificationService notificationService;

    public RestNotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<List<NotificationDTO>> getNotifications(Principal principal) {
        String email = principal != null ? principal.getName() : "user@agrolink.com";
        logger.info("REST request for notifications for user {}", email);
        List<NotificationDTO> notifications = notificationService.getUserNotifications(email);
        return ApiResponse.success(notifications);
    }

    @PostMapping("/{id}/read")
    public ApiResponse<String> markRead(@PathVariable String id) {
        logger.info("REST request to mark notification {} as read", id);
        notificationService.markAsRead(id);
        return ApiResponse.success("Notification marked as read");
    }
}
