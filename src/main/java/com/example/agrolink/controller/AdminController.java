package com.example.agrolink.controller;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.service.AdminService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/admin/dashboard")
    public String dashboard(Model model) {

        try {
            logger.info("Loading admin dashboard");

            AdminDashboardDTO dashboard = adminService.getDashboardData();

            model.addAttribute("dashboard", dashboard);

            return "admin-dashboard";

        } catch (Exception e) {
            logger.error("Error loading admin dashboard", e);
            return "error";
        }
    }
}