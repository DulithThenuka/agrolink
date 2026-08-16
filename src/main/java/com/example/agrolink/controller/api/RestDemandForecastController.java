package com.example.agrolink.controller.api;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.DemandForecastDTO;
import com.example.agrolink.service.DemandForecastService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/demand-forecasting")
public class RestDemandForecastController {

    private final DemandForecastService demandForecastService;

    public RestDemandForecastController(DemandForecastService demandForecastService) {
        this.demandForecastService = demandForecastService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DemandForecastDTO>> getDemandForecast(@RequestParam(value = "province", required = false, defaultValue = "Western Province") String province) {
        DemandForecastDTO data = demandForecastService.getDemandForecast(province);
        return ResponseEntity.ok(ApiResponse.success("Demand forecast retrieved successfully", data));
    }
}
