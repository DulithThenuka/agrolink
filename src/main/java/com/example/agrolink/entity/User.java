package com.example.agrolink.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_role", columnList = "role")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @NotBlank
    @Size(min = 6)
    @JsonIgnore
    @Column(nullable = false, length = 100)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.BUYER;

    @Column(length = 100)
    private String location;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private boolean accountNonLocked = true;

    @Column(nullable = false)
    private boolean accountNonExpired = true;

    @Column(nullable = false)
    private boolean credentialsNonExpired = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @OneToMany(mappedBy = "farmer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Crop> crops;

    @OneToMany(mappedBy = "buyer")
    @JsonIgnore
    private List<Order> orders;

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        normalizeEmail();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        normalizeEmail();
    }

    // ================== DOMAIN METHODS ==================

    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

    public boolean isFarmer() {
        return this.role == Role.FARMER;
    }

    public boolean isBuyer() {
        return this.role == Role.BUYER;
    }

    public void disable() {
        this.enabled = false;
    }

    public void lock() {
        this.accountNonLocked = false;
    }

    // ================== INTERNAL ==================

    private void normalizeEmail() {
        if (this.email != null) {
            this.email = this.email.toLowerCase().trim();
        }
    }
}