package com.example.agrolink.feature.order;

import com.example.agrolink.dto.OrderDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    // 📦 PLACE ORDER
    OrderDTO placeOrder(String buyerEmail, Long cropId, Integer quantity);

    // 👤 BUYER ORDERS
    Page<OrderDTO> getUserOrders(String email, Pageable pageable);

    // 🌾 FARMER ORDERS
    Page<OrderDTO> getFarmerOrders(String farmerEmail, Pageable pageable);

    // 🔍 GET ORDER
    OrderDTO getOrderById(Long id);

    // 🔄 UPDATE STATUS
    void updateOrderStatus(Long orderId, String status);

    // 💰 PAYMENT
    void markAsPaid(Long orderId);
}