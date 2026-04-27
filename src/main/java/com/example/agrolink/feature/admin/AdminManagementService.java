package com.example.agrolink.feature.admin;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.OrderDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminManagementService {

    // ================== DASHBOARD ==================
    AdminDashboardDTO getDashboardData();

    // ================== USERS ==================
    Page<UserDTO> getAllUsers(Pageable pageable);

    void lockUser(Long userId);

    void unlockUser(Long userId);

    // ================== ORDERS ==================
    Page<OrderDTO> getAllOrders(Pageable pageable);

    // ================== CROPS ==================
    void deactivateCrop(Long cropId);

    void restoreCrop(Long cropId);
}