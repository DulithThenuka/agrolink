package com.example.agrolink.feature.order;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.entity.OrderStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    // ================== PLACE ORDER ==================
    OrderDTO placeOrder(String buyerEmail, Long cropId, int quantity);

    // ================== BUYER ==================
    Page<OrderDTO> getUserOrders(String email, Pageable pageable);

    // ================== FARMER ==================
    Page<OrderDTO> getFarmerOrders(String farmerEmail, Pageable pageable);

    // ================== READ ==================
    OrderDTO getOrderById(Long id);

    // ================== STATUS ==================
    void updateOrderStatus(Long orderId, OrderStatus status, String userEmail);

    void cancelOrder(Long orderId, String userEmail);

    // ================== PAYMENT ==================
    void markAsPaid(Long orderId, String userEmail);

    OrderDTO placeOrder(String email, Long cropId, Integer quantity);

    void updateOrderStatus(Long orderId, String status);

    void markAsPaid(Long orderId);
}