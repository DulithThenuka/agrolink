package com.example.agrolink.feature.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.dto.UserDTO;

public interface AdminManagementService {

    // ================== DASHBOARD ==================

    AdminDashboardDTO getDashboardData();

    // ================== USER MANAGEMENT ==================

    Page<UserDTO> getAllUsers(Pageable pageable);

    void lockUser(Long userId);

    void unlockUser(Long userId);

    // ================== ORDER MANAGEMENT ==================

    Page<OrderDTO> getAllOrders(Pageable pageable);

    // ================== CROP MANAGEMENT ==================

    void deactivateCrop(Long cropId);

    void restoreCrop(Long cropId);
}