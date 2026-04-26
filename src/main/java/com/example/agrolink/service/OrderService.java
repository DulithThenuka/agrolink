package com.example.agrolink.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository repo;
    private final CropService cropService;

    public OrderService(OrderRepository repo, CropService cropService) {
        this.repo = repo;
        this.cropService = cropService;
    }

    @Transactional
    public Order placeOrder(User buyer, Long cropId, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException("Invalid quantity");
        }

        Crop crop = cropService.getById(cropId);

        if (crop.getFarmer().getId().equals(buyer.getId())) {
            throw new RuntimeException("You cannot order your own crop");
        }

        if (quantity > crop.getQuantity()) {
            throw new RuntimeException("Not enough stock available");
        }

        BigDecimal total = crop.getPrice().multiply(BigDecimal.valueOf(quantity));

        // update stock
        crop.setQuantity(crop.getQuantity() - quantity);
        cropService.save(crop);

        Order order = new Order();
        order.setBuyer(buyer);
        order.setCrop(crop);
        order.setQuantity(quantity);
        order.setTotalPrice(total);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        return repo.save(order);
    }

    public List<Order> getUserOrders(User buyer) {
        return repo.findByBuyer(buyer);
    }

    public Order getOrderById(Long id) {
    return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
}

public void markAsPaid(Long orderId) {
    Order order = getOrderById(orderId);
    order.setStatus(OrderStatus.CONFIRMED);
    orderRepository.save(order);
}
}