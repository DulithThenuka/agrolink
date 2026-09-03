package com.example.agrolink.controller.api;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.FarmerDashboardDTO;
import com.example.agrolink.service.FarmerDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/farmer", "/api/farmer"})
@PreAuthorize("hasRole('FARMER')")
public class RestFarmerDashboardController {

    private final FarmerDashboardService farmerDashboardService;

    public RestFarmerDashboardController(FarmerDashboardService farmerDashboardService) {
        this.farmerDashboardService = farmerDashboardService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<FarmerDashboardDTO>> getFarmerDashboard(Authentication auth) {
        String email = auth != null ? auth.getName() : "";
        FarmerDashboardDTO data = farmerDashboardService.getFarmerDashboard(email);
        return ResponseEntity.ok(ApiResponse.success("Farmer dashboard retrieved successfully", data));
    }
}
