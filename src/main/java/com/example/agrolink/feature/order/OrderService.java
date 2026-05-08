package com.example.agrolink.feature.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.entity.OrderStatus;

public interface OrderService {

    // ================== PLACE ORDER ==================

    OrderDTO placeOrder(
            String buyerEmail,
            Long cropId,
            int quantity
    );

    // ================== BUYER ==================

    Page<OrderDTO> getUserOrders(
            String buyerEmail,
            Pageable pageable
    );

    // ================== FARMER ==================

    Page<OrderDTO> getFarmerOrders(
            String farmerEmail,
            Pageable pageable
    );

    // ================== READ ==================

    OrderDTO getOrderById(Long id);

    // ================== STATUS ==================

    void updateOrderStatus(
            Long orderId,
            OrderStatus status,
            String userEmail
    );

    void cancelOrder(
            Long orderId,
            String userEmail
    );

    // ================== PAYMENT ==================

    void markAsPaid(Long orderId);
}