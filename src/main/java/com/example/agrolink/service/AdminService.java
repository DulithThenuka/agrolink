package com.example.agrolink.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.agrolink.entity.Order;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;

    public AdminService(UserRepository userRepository,
                        CropRepository cropRepository,
                        OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalCrops() {
        return cropRepository.count();
    }

    public long getTotalOrders() {
        return orderRepository.count();
    }

    public List<Order> getRecentOrders() {
        return orderRepository.findTop5ByOrderByCreatedAtDesc();
    }
}