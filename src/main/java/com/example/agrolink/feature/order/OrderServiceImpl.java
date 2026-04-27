package com.example.agrolink.feature.order;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.entity.*;
import com.example.agrolink.exception.ResourceNotFoundException;
import com.example.agrolink.mapper.OrderMapper;
import com.example.agrolink.repository.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CropRepository cropRepository,
                            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ================== PLACE ORDER ==================
    @Override
    public OrderDTO placeOrder(String email, Long cropId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Invalid quantity");
        }

        User buyer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found"));

        // 🔐 prevent self-order
        if (crop.getFarmer() == null ||
            crop.getFarmer().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("You cannot order your own crop");
        }

        // 📦 stock validation
        if (crop.getQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock");
        }

        // 💰 calculate price
        BigDecimal total = crop.getPrice().multiply(BigDecimal.valueOf(quantity));

        // 📉 update stock
        crop.setQuantity(crop.getQuantity() - quantity);
        cropRepository.save(crop); // ✅ important

        // 📦 create order
        Order order = new Order();
        order.setBuyer(buyer);
        order.setCrop(crop);
        order.setQuantity(quantity);
        order.setTotalPrice(total);
        order.setStatus(OrderStatus.PENDING);

        Order saved = orderRepository.save(order);

        return OrderMapper.toDTO(saved);
    }

    // ================== BUYER ORDERS ==================
    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getUserOrders(String email, Pageable pageable) {

        User buyer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByBuyerOrderByCreatedAtDesc(buyer, pageable)
                .map(OrderMapper::toDTO);
    }

    // ================== FARMER ORDERS ==================
    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getFarmerOrders(String email, Pageable pageable) {

        User farmer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findFarmerOrders(farmer, pageable)
                .map(OrderMapper::toDTO);
    }

    // ================== GET ORDER ==================
    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return OrderMapper.toDTO(order);
    }

    // ================== UPDATE STATUS ==================
    @Override
    public void updateOrderStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid order status");
        }

        // 🔄 validate transition
        order.getStatus().validateTransition(newStatus);

        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    // ================== PAYMENT ==================
    @Override
    public void markAsPaid(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // 🔁 idempotency check
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            return;
        }

        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
    }
}