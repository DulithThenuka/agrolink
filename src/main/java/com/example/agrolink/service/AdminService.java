package com.example.agrolink.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
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

    public AdminDashboardDTO getDashboardData() {

        long totalUsers = userRepository.count();
        long totalCrops = cropRepository.count();
        long totalOrders = orderRepository.count();

        List<OrderSummaryDTO> recentOrders =
                orderRepository.findByOrderByCreatedAtDesc(PageRequest.of(0, 5))
                        .getContent()
                        .stream()
                        .map(order -> new OrderSummaryDTO(
                                order.getId(),
                                order.getCrop().getName(),
                                order.getQuantity(),
                                order.getBuyer().getEmail(),
                                order.getStatus().name(),
                                order.getCreatedAt()
                        ))
                        .toList();

        return new AdminDashboardDTO(
                totalUsers,
                totalCrops,
                totalOrders,
                recentOrders
        );
    }
}