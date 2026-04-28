package com.example.agrolink.mapper;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.dto.OrderSummaryDTO;

import java.util.List;

import com.example.agrolink.entity.Order;

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
                getCropId(order),
                order.getQuantity(),
                order.getTotalPrice(),
                getStatus(order),
                getStatusLabel(order),
                order.isPaid(),
                order.getCreatedAt()
        );
    }

    // ================== ENTITY → SUMMARY DTO ==================

    public static OrderSummaryDTO toSummaryDTO(Order order) {
        if (order == null) return null;

        return new OrderSummaryDTO(
                order.getId(),
                getCropName(order),
                getCropId(order),
                order.getQuantity(),
                getBuyerEmail(order),
                getStatus(order),
                getStatusLabel(order),
                order.isPaid(),
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
                ? ((Object) order.getCrop()).getName()
                : "Unknown Crop";
    }

    private static Long getCropId(Order order) {
        return order.getCrop() != null
                ? ((OrderDTO) order.getCrop()).getId()
                : null;
    }

    private static String getBuyerEmail(Order order) {
        return order.getBuyer() != null
                ? ((Object) order.getBuyer()).getEmail()
                : "Unknown Buyer";
    }

    private static String getStatus(Order order) {
        return order.getStatus() != null
                ? ((Object) order.getStatus()).name()
                : "UNKNOWN";
    }

    private static String getStatusLabel(Order order) {
        if (order.getStatus() == null) return "Unknown";

        switch (order.getStatus()) {
            case PENDING: return "Pending";
            case CONFIRMED: return "Confirmed";
            case CANCELLED: return "Cancelled";
            default: return "Unknown";
        }
    }
}