package com.example.agrolink.mapper;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.entity.Order;

public class OrderMapper {

    // ✅ ENTITY → DTO
    public static OrderDTO toDTO(Order order) {
        if (order == null) return null;

        return new OrderDTO(
                order.getId(),
                order.getCrop() != null ? order.getCrop().getName() : null,
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus().name(), // ✅ enum → string
                order.getCreatedAt()
        );
    }
}