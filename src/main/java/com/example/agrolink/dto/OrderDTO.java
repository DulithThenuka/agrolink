package com.example.agrolink.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.agrolink.entity.OrderStatus;

public class OrderDTO {

    private Long id;
    private String cropName;
    private int quantity;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private LocalDateTime createdAt;

    public OrderDTO() {}

    public OrderDTO(Long id, String cropName, int quantity,
                    BigDecimal totalPrice, OrderStatus status,
                    LocalDateTime createdAt) {
        this.id = id;
        this.cropName = cropName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
    }

    // getters & setters
}