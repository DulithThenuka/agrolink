package com.example.agrolink.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.entity.Order;

public final class OrderMapper {

    private OrderMapper() {

        throw new UnsupportedOperationException(
                "Utility class"
        );
    }

    // ================== ENTITY → DTO ==================

    public static OrderDTO toDTO(Order order) {

        if (order == null) {
            return null;
        }

        String farmerName = order.getCrop() != null && order.getCrop().getFarmer() != null
                ? order.getCrop().getFarmer().getName()
                : "Unknown Farmer";

        String buyerName = order.getBuyer() != null ? order.getBuyer().getName() : "Unknown Buyer";
        String buyerEmail = order.getBuyer() != null ? order.getBuyer().getEmail() : "";

        String driverName = order.getDriver() != null ? order.getDriver().getName() : null;
        String driverEmail = order.getDriver() != null ? order.getDriver().getEmail() : null;

        String escrowStatusName = order.getEscrowStatus() != null ? order.getEscrowStatus().name() : "HELD_IN_ESCROW";
        String escrowStatusLabel = order.getEscrowStatus() != null ? order.getEscrowStatus().getLabel() : "Held in Escrow";

        return new OrderDTO(
                order.getId(),
                getCropName(order),
                getCropId(order),
                order.getQuantity(),
                order.getTotalPrice(),
                getStatus(order),
                getStatusLabel(order),
                order.isPaid(),
                buyerName,
                buyerEmail,
                farmerName,
                order.getPickupLocation(),
                order.getDeliveryLocation(),
                order.getDistanceKm(),
                order.getLogisticsFee(),
                driverName,
                driverEmail,
                order.getCurrentLat(),
                order.getCurrentLng(),
                order.getTrackingNotes(),
                escrowStatusName,
                escrowStatusLabel,
                order.getDisputeReason(),
                order.getDisputeResolution(),
                order.getDisputeRaisedAt(),
                order.getCreatedAt()
        );
    }

    // ================== ENTITY → SUMMARY ==================

    public static OrderSummaryDTO toSummaryDTO(
            Order order) {

        if (order == null) {
            return null;
        }

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

    // ================== LIST ==================

    public static List<OrderDTO> toDTOList(
            List<Order> orders) {

        if (orders == null) {
            return List.of();
        }

        return orders.stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static List<OrderSummaryDTO> toSummaryDTOList(
            List<Order> orders) {

        if (orders == null) {
            return List.of();
        }

        return orders.stream()
                .map(OrderMapper::toSummaryDTO)
                .collect(Collectors.toList());
    }

    // ================== HELPERS ==================

    private static String getCropName(
            Order order) {

        return order.getCrop() != null
                ? order.getCrop().getName()
                : "Unknown Crop";
    }

    private static Long getCropId(
            Order order) {

        return order.getCrop() != null
                ? order.getCrop().getId()
                : null;
    }

    private static String getBuyerEmail(
            Order order) {

        return order.getBuyer() != null
                ? order.getBuyer().getEmail()
                : "Unknown Buyer";
    }

    private static String getStatus(
            Order order) {

        return order.getStatus() != null
                ? order.getStatus().name()
                : "UNKNOWN";
    }

    private static String getStatusLabel(
            Order order) {

        if (order.getStatus() == null) {
            return "Unknown";
        }

        return order.getStatus().getLabel();
    }
}