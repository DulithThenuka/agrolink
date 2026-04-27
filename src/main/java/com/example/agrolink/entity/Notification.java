package com.example.agrolink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_user", columnList = "user_id"),
        @Index(name = "idx_notification_read", columnList = "is_read")
})
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 500)
    private String message;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationType type;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ================== BUSINESS METHODS ==================

    public void markAsRead() {
        this.read = true;
    }

    // ================== GETTERS ==================

    public Long getId() { return id; }

    public String getMessage() { return message; }

    public boolean isRead() { return read; }

    public NotificationType getType() { return type; }

    public User getUser() { return user; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    // ================== SETTERS ==================

    public void setMessage(String message) { this.message = message; }

    public void setRead(boolean read) { this.read = read; }

    public void setType(NotificationType type) { this.type = type; }

    public void setUser(User user) { this.user = user; }
}