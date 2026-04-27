package com.example.agrolink.feature.admin;

import com.example.agrolink.dto.*;
import com.example.agrolink.entity.*;
import com.example.agrolink.repository.*;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            CropRepository cropRepository,
                            OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
    }

    // ================== DASHBOARD ==================
    @Override
    public AdminDashboardDTO getDashboardData() {

        long totalUsers = userRepository.count();
        long totalCrops = cropRepository.count();
        long totalOrders = orderRepository.count();

        var recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToSummary)
                .toList();

        return new AdminDashboardDTO(
                totalUsers,
                totalCrops,
                totalOrders,
                recentOrders
        );
    }

    // ================== USERS ==================
    @Override
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getLocation()
                ));
    }

    @Override
    @Transactional
    public void lockUser(Long userId) {
        User user = getUserOrThrow(userId);
        user.setAccountNonLocked(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void unlockUser(Long userId) {
        User user = getUserOrThrow(userId);
        user.setAccountNonLocked(true);
        userRepository.save(user);
    }

    // ================== ORDERS ==================
    @Override
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findByOrderByCreatedAtDesc(pageable)
                .map(order -> new OrderDTO(
                        order.getId(),
                        getCropName(order),
                        order.getQuantity(),
                        order.getTotalPrice(),
                        order.getStatus().name(),
                        order.getCreatedAt()
                ));
    }

    // ================== CROPS ==================
    @Override
    @Transactional
    public void deactivateCrop(Long cropId) {
        Crop crop = getCropOrThrow(cropId);
        crop.setActive(false);
        cropRepository.save(crop);
    }

    @Override
    @Transactional
    public void restoreCrop(Long cropId) {
        Crop crop = getCropOrThrow(cropId);
        crop.setActive(true);
        cropRepository.save(crop);
    }

    // ================== HELPERS ==================
    private OrderSummaryDTO mapToSummary(Order order) {

        return new OrderSummaryDTO(
                order.getId(),
                getCropName(order),
                order.getQuantity(),
                getBuyerEmail(order),
                order.getStatus() != null ? order.getStatus().name() : "UNKNOWN",
                order.getCreatedAt()
        );
    }

    private String getCropName(Order order) {
        return (order.getCrop() != null)
                ? order.getCrop().getName()
                : "N/A";
    }

    private String getBuyerEmail(Order order) {
        return (order.getBuyer() != null)
                ? order.getBuyer().getEmail()
                : "N/A";
    }

    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Crop getCropOrThrow(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found"));
    }
}