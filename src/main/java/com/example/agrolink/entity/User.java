package com.example.agrolink.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_role", columnList = "role")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
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

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @OneToMany(
            mappedBy = "farmer",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Crop> crops = new ArrayList<>();

    @OneToMany(mappedBy = "buyer")
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();

    // ================== CONSTRUCTORS ==================

    public User() {
    }

    // ================== LIFECYCLE ==================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        normalizeFields();
    }

    @PreUpdate
    protected void onUpdate() {

        this.updatedAt = LocalDateTime.now();

        normalizeFields();
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

    public void enable() {
        this.enabled = true;
    }

    public void lock() {
        this.accountNonLocked = false;
    }

    public void unlock() {
        this.accountNonLocked = true;
    }

    // ================== INTERNAL ==================

    private void normalizeFields() {

        if (this.name != null) {
            this.name = this.name.trim();
        }

        if (this.email != null) {
            this.email = this.email.toLowerCase().trim();
        }

        if (this.location != null) {
            this.location = this.location.trim();
        }
    }

    // ================== GETTERS ==================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public String getLocation() {
        return location;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Long getVersion() {
        return version;
    }

    public List<Crop> getCrops() {
        return crops;
    }

    public List<Order> getOrders() {
        return orders;
    }

    // ================== SETTERS ==================

    public void setName(String name) {

        if (name == null || name.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Name cannot be empty"
            );
        }

        this.name = name.trim();
    }

    public void setEmail(String email) {

        if (email == null || email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email cannot be empty"
            );
        }

        this.email = email.toLowerCase().trim();
    }

    public void setPassword(String password) {

        if (password == null || password.length() < 6) {

            throw new IllegalArgumentException(
                    "Password must be at least 6 characters"
            );
        }

        this.password = password;
    }

    public void setRole(Role role) {

        if (role == null) {

            throw new IllegalArgumentException(
                    "Role cannot be null"
            );
        }

        this.role = role;
    }

    public void setLocation(String location) {

        this.location = location == null
                ? null
                : location.trim();
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setAccountNonLocked(boolean accountNonLocked) {
        this.accountNonLocked = accountNonLocked;
    }

    public void setAccountNonExpired(boolean accountNonExpired) {
        this.accountNonExpired = accountNonExpired;
    }

    public void setCredentialsNonExpired(boolean credentialsNonExpired) {
        this.credentialsNonExpired = credentialsNonExpired;
    }

    public void setCrops(List<Crop> crops) {
        this.crops = crops;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}