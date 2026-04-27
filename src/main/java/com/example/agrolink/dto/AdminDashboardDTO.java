package com.example.agrolink.dto;

import java.util.List;

public final class AdminDashboardDTO {

    private final long totalUsers;
    private final long totalCrops;
    private final long totalOrders;
    private final List<OrderSummaryDTO> recentOrders;

    public AdminDashboardDTO(long totalUsers,
                             long totalCrops,
                             long totalOrders,
                             List<OrderSummaryDTO> recentOrders) {

        this.totalUsers = totalUsers;
        this.totalCrops = totalCrops;
        this.totalOrders = totalOrders;
        this.recentOrders = recentOrders == null
                ? List.of()
                : List.copyOf(recentOrders); // 🔒 defensive copy
    }

    public long getTotalUsers() { return totalUsers; }

    public long getTotalCrops() { return totalCrops; }

    public long getTotalOrders() { return totalOrders; }

    public List<OrderSummaryDTO> getRecentOrders() { return recentOrders; }
}