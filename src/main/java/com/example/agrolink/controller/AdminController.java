package com.example.agrolink.controller;

import com.example.agrolink.dto.AdminDashboardDTO;
import com.example.agrolink.service.AdminService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {

        logger.info("Loading admin dashboard");

        AdminDashboardDTO dashboard = adminService.getDashboardData();

        if (dashboard == null) {
        logger.warn("Dashboard data is null");
    }

        model.addAttribute("dashboard", dashboard);

        return "admin-dashboard";
    }
}