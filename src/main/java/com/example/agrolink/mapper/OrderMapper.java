package com.example.agrolink.mapper;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.entity.Order;

import java.util.List;

public final class OrderMapper {

    private OrderMapper() {
        throw new UnsupportedOperationException("Utility class");
    }

    // ================== ENTITY → DTO ==================

    public static OrderDTO toDTO(Order order) {
        if (order == null) return null;

        return new OrderDTO(
                order.getId(),
                getCropName(order),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus(),
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
                getStatus(order),
                order.getCreatedAt()
        );
    }

    // ================== LIST MAPPING ==================

    public static List<OrderDTO> toDTOList(List<Order> orders) {
        if (orders == null) return List.of();

        return orders.stream()
                .map(OrderMapper::toDTO)
                .toList();
    }

    public static List<OrderSummaryDTO> toSummaryDTOList(List<Order> orders) {
        if (orders == null) return List.of();

        return orders.stream()
                .map(OrderMapper::toSummaryDTO)
                .toList();
    }

    // ================== HELPERS ==================

    private static String getCropName(Order order) {
        return order.getCrop() != null
                ? order.getCrop().getName()
                : "Unknown Crop";
    }

    private static String getBuyerEmail(Order order) {
        return order.getBuyer() != null
                ? order.getBuyer().getEmail()
                : "Unknown Buyer";
    }

    private static String getStatus(Order order) {
        return order.getStatus() != null
                ? order.getStatus().name()
                : "UNKNOWN";
    }
}