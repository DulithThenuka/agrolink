package com.example.agrolink.dto;

import java.util.List;

public class AdminDashboardDTO {

    private long totalUsers;
    private long totalCrops;
    private long totalOrders;
    private List<OrderSummaryDTO> recentOrders;

    // ✅ Default constructor
    public AdminDashboardDTO() {}

    // ✅ All-args constructor
    public AdminDashboardDTO(long totalUsers, long totalCrops,
                             long totalOrders,
                             List<OrderSummaryDTO> recentOrders) {
        this.totalUsers = totalUsers;
        this.totalCrops = totalCrops;
        this.totalOrders = totalOrders;
        this.recentOrders = recentOrders;
    }

    // ✅ Getters & Setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCrops() {
        return totalCrops;
    }

    public void setTotalCrops(long totalCrops) {
        this.totalCrops = totalCrops;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public List<OrderSummaryDTO> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<OrderSummaryDTO> recentOrders) {
        this.recentOrders = recentOrders;
    }
}