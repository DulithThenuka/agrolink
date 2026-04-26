package com.example.agrolink.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;

@Service
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);
    private static final int RECENT_LIMIT = 5;

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

        logger.info("Fetching admin dashboard data");

        long totalUsers = userRepository.count();
        long totalCrops = cropRepository.count();
        long totalOrders = orderRepository.count();

        List<OrderSummaryDTO> recentOrders =
                orderRepository.findRecentOrders(PageRequest.of(0, RECENT_LIMIT))
                        .getContent()
                        .stream()
                        .map(order -> new OrderSummaryDTO(
                                order.getId(),
                                order.getCrop() != null ? order.getCrop().getName() : "N/A",
                                order.getQuantity(),
                                order.getBuyer() != null ? order.getBuyer().getEmail() : "N/A",
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