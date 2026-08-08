package com.example.agrolink.controller;

import com.example.agrolink.dto.FarmerDashboardDTO;
import com.example.agrolink.service.FarmerDashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/farmer")
@PreAuthorize("hasRole('FARMER')")
public class FarmerDashboardController {

    private final FarmerDashboardService farmerDashboardService;

    public FarmerDashboardController(FarmerDashboardService farmerDashboardService) {
        this.farmerDashboardService = farmerDashboardService;
    }

    @GetMapping("/dashboard")
    public String farmerDashboard(Authentication auth, Model model) {
        String email = auth != null ? auth.getName() : "";
        FarmerDashboardDTO dashboard = farmerDashboardService.getFarmerDashboard(email);
        model.addAttribute("farmerDashboard", dashboard);
        return "pages/dashboard/farmer-dashboard";
    }
}
