package com.example.agrolink.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CropService cropService;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository, CropService cropService, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cropService = cropService;
        this.emailService = emailService;
    }

    public Order placeOrder(User buyer, Long cropId, int quantity) {

        Crop crop = cropService.getById(cropId);

        if (crop == null || !crop.isActive()) {
            throw new RuntimeException("Crop not available");
        }

        if (quantity > crop.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

        double total = crop.getPrice() * quantity;

        Order order = new Order();
        order.setBuyer(buyer);
        order.setCrop(crop);
        order.setQuantity(quantity);
        order.setTotalPrice(total);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        // Reduce stock
        crop.setQuantity(crop.getQuantity() - quantity);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User buyer) {
        return orderRepository.findByBuyer(buyer);
    }
}