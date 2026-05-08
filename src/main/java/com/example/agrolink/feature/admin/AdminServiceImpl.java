package com.example.agrolink.feature.admin;

import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminManagementService {

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

        var recentOrders = orderRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

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
                        user.getRole(),
                        user.getLocation(),
                        user.isEnabled()
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

        return orderRepository.findAll(pageable)
                .map(order -> new OrderDTO(
                        order.getId(),
                        getCropName(order),
                        getCropId(order),
                        order.getQuantity(),
                        order.getTotalPrice(),
                        getStatus(order),
                        getStatusLabel(order),
                        order.isPaid(),
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
                getCropId(order),
                order.getQuantity(),
                getBuyerEmail(order),
                getStatus(order),
                getStatusLabel(order),
                order.isPaid(),
                order.getCreatedAt()
        );
    }

    private String getCropName(Order order) {

        return order.getCrop() != null
                ? order.getCrop().getName()
                : "N/A";
    }

    private Long getCropId(Order order) {

        return order.getCrop() != null
                ? order.getCrop().getId()
                : null;
    }

    private String getBuyerEmail(Order order) {

        return order.getBuyer() != null
                ? order.getBuyer().getEmail()
                : "N/A";
    }

    private String getStatus(Order order) {

        return order.getStatus() != null
                ? order.getStatus().name()
                : "UNKNOWN";
    }

    private String getStatusLabel(Order order) {

        return order.getStatus() != null
                ? order.getStatus().getLabel()
                : "Unknown";
    }

    private User getUserOrThrow(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }

    private Crop getCropOrThrow(Long id) {

        return cropRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Crop not found"));
    }
}