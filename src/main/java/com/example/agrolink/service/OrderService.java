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

    private final OrderRepository repo;
    private final CropService cropService;

    public OrderService(OrderRepository repo, CropService cropService) {
        this.repo = repo;
        this.cropService = cropService;
    }

    public Order placeOrder(User buyer, Long cropId, int quantity) {

        Crop crop = cropService.getById(cropId);

        if (quantity > crop.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

        double total = crop.getPrice() * quantity;

        // ✅ FIX: update stock
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
}