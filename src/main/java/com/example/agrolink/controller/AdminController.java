package com.example.agrolink.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.agrolink.service.AdminService;

@Controller
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/admin/dashboard")
    public String dashboard(Model model) {

        model.addAttribute("totalUsers", adminService.getTotalUsers());
        model.addAttribute("totalCrops", adminService.getTotalCrops());
        model.addAttribute("totalOrders", adminService.getTotalOrders());
        model.addAttribute("recentOrders", adminService.getRecentOrders());

        return "admin-dashboard";
    }
}