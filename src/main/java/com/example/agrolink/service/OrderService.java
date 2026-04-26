package com.example.agrolink.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CropRepository cropRepository;

    public OrderService(OrderRepository orderRepository,
                        CropRepository cropRepository) {
        this.orderRepository = orderRepository;
        this.cropRepository = cropRepository;
    }

    // ================== PLACE ORDER ==================
    @Transactional
    public Order placeOrder(User buyer, Long cropId, int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException("Invalid quantity");
        }

        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found"));

        // ❌ prevent ordering inactive crop
        if (!crop.isActive()) {
            throw new IllegalArgumentException("Crop is not available");
        }

        // ❌ prevent buying own crop
        if (crop.getFarmer().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("You cannot order your own crop");
        }

        // ❌ stock validation
        if (quantity > crop.getQuantity()) {
            throw new IllegalArgumentException("Not enough stock available");
        }

        BigDecimal total = crop.getPrice().multiply(BigDecimal.valueOf(quantity));

        // ✅ update stock safely (inside transaction)
        crop.setQuantity(crop.getQuantity() - quantity);
        cropRepository.save(crop);

        Order order = new Order();
        order.setBuyer(buyer);
        order.setCrop(crop);
        order.setQuantity(quantity);
        order.setTotalPrice(total);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        logger.info("Order created for user {} crop {}", buyer.getEmail(), cropId);

        return orderRepository.save(order);
    }

    // ================== GET USER ORDERS ==================
    public List<Order> getUserOrders(User buyer) {
        return orderRepository.findByBuyerOrderByCreatedAtDesc(buyer);
    }

    // ================== GET ORDER ==================
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    // ================== MARK AS PAID ==================
    @Transactional
    public void markAsPaid(Long orderId) {

        Order order = getOrderById(orderId);

        // ✅ idempotency check (VERY IMPORTANT)
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            logger.warn("Order {} already confirmed", orderId);
            return;
        }

        order.setStatus(OrderStatus.CONFIRMED);

        orderRepository.save(order);

        logger.info("Order {} marked as PAID", orderId);
    }
}