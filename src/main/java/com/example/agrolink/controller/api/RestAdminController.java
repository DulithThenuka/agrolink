package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.*;
import com.example.agrolink.service.AdminService;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class RestAdminController {

    private static final Logger logger = LoggerFactory.getLogger(RestAdminController.class);

    private final AdminService adminService;

    public RestAdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardDTO> getDashboard() {
        logger.info("REST Load admin dashboard");
        AdminDashboardDTO data = adminService.getDashboardData();
        return ApiResponse.success(data);
    }
}
