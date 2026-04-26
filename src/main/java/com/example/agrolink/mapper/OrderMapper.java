package com.example.agrolink.mapper;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.entity.Order;

public final class OrderMapper {

    private OrderMapper() {
        // prevent instantiation
    }

    // ================== ENTITY → DTO ==================
    public static OrderDTO toDTO(Order order) {
        if (order == null) return null;

        return new OrderDTO(
                order.getId(),
                getCropName(order),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus(), // ✅ FIXED (enum)
                order.getCreatedAt()
        );
    }

    // ================== ENTITY → SUMMARY DTO ==================
    public static OrderSummaryDTO toSummaryDTO(Order order) {
        if (order == null) return null;

        return new OrderSummaryDTO(
                order.getId(),
                getCropName(order),
                order.getQuantity(),
                getBuyerEmail(order),
                order.getStatus() != null ? order.getStatus().name() : null,
                order.getCreatedAt()
        );
    }

    // ================== HELPERS ==================
    private static String getCropName(Order order) {
        return (order.getCrop() != null) ? order.getCrop().getName() : null;
    }

    private static String getBuyerEmail(Order order) {
        return (order.getBuyer() != null) ? order.getBuyer().getEmail() : null;
    }
}package com.example.agrolink.mapper;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.entity.Order;

public final class OrderMapper {

    private OrderMapper() {
        // prevent instantiation
    }

    // ================== ENTITY → DTO ==================
    public static OrderDTO toDTO(Order order) {
        if (order == null) return null;

        return new OrderDTO(
                order.getId(),
                getCropName(order),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus(), // ✅ FIXED (enum)
                order.getCreatedAt()
        );
    }

    // ================== ENTITY → SUMMARY DTO ==================
    public static OrderSummaryDTO toSummaryDTO(Order order) {
        if (order == null) return null;

        return new OrderSummaryDTO(
                order.getId(),
                getCropName(order),
                order.getQuantity(),
                getBuyerEmail(order),
                order.getStatus() != null ? order.getStatus().name() : null,
                order.getCreatedAt()
        );
    }

    // ================== HELPERS ==================
    private static String getCropName(Order order) {
        return (order.getCrop() != null) ? order.getCrop().getName() : null;
    }

    private static String getBuyerEmail(Order order) {
        return (order.getBuyer() != null) ? order.getBuyer().getEmail() : null;
    }
}