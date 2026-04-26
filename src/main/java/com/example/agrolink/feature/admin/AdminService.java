package com.example.agrolink.feature.admin;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.OrderDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    // 📊 Dashboard
    AdminDashboardDTO getDashboardData();

    // 👤 User management
    Page<UserDTO> getAllUsers(Pageable pageable);
    void lockUser(Long userId);
    void unlockUser(Long userId);

    // 📦 Order management
    Page<OrderDTO> getAllOrders(Pageable pageable);

    // 🌾 Crop management
    void deactivateCrop(Long cropId);
    void restoreCrop(Long cropId);
}