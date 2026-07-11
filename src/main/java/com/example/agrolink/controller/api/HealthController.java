package com.example.agrolink.controller.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.agrolink.dto.ApiResponse;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ApiResponse<Void> getHealth() {
        return ApiResponse.success("AgroLink API is running");
    }
}
