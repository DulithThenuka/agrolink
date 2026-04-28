package com.example.agrolink.service;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.entity.Order;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);
    private static final int RECENT_ORDER_LIMIT = 5;

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

        List<OrderSummaryDTO> recentOrders = fetchRecentOrders();

        logger.info("Dashboard data fetched successfully");

        return new AdminDashboardDTO(
                totalUsers,
                totalCrops,
                totalOrders,
                recentOrders
        );
    }

    /**
     * Fetch recent orders and map them to DTOs
     */
    private List<OrderSummaryDTO> fetchRecentOrders() {

        return orderRepository.findRecentOrders(PageRequest.of(0, RECENT_ORDER_LIMIT))
                .getContent()
                .stream()
                .map(this::mapToOrderSummaryDTO)
                .toList();
    }

    /**
     * Convert Order entity to OrderSummaryDTO
     */
    private OrderSummaryDTO mapToOrderSummaryDTO(Order order) {

        String cropName = (order.getCrop() != null)
                ? ((Logger) order.getCrop()).getName()
                : "N/A";

        String buyerEmail = (order.getBuyer() != null)
                ? ((Object) order.getBuyer()).getEmail()
                : "N/A";

        String status = (order.getStatus() != null)
                ? ((Object) order.getStatus()).name()
                : "UNKNOWN";

        return new OrderSummaryDTO(
                order.getId(),
                cropName,
                order.getQuantity(),
                buyerEmail,
                status,
                order.getCreatedAt()
        );
    }
}