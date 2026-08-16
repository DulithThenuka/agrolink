package com.example.agrolink.controller.api;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.AnalyticsDTO;
import com.example.agrolink.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
public class RestAnalyticsController {

    private final AnalyticsService analyticsService;

    public RestAnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getAnalytics() {
        AnalyticsDTO data = analyticsService.getAnalyticsData();
        return ResponseEntity.ok(ApiResponse.success("Analytics data retrieved successfully", data));
    }

}
