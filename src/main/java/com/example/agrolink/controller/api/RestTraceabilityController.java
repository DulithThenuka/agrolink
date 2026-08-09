package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.CropBatchTraceDTO;
import com.example.agrolink.service.CropService;

@RestController
@RequestMapping("/api/v1/trace")
public class RestTraceabilityController {

    private static final Logger logger = LoggerFactory.getLogger(RestTraceabilityController.class);

    private final CropService cropService;

    public RestTraceabilityController(CropService cropService) {
        this.cropService = cropService;
    }

    @GetMapping("/{batchCode}")
    public ApiResponse<CropBatchTraceDTO> getBatchTraceability(@PathVariable String batchCode) {
        logger.info("REST Fetching traceability data for batchCode: {}", batchCode);
        CropBatchTraceDTO trace = cropService.getBatchTraceability(batchCode);
        return ApiResponse.success(trace);
    }

    @GetMapping("/crop/{cropId}")
    public ApiResponse<CropBatchTraceDTO> getCropTraceability(@PathVariable Long cropId) {
        logger.info("REST Fetching traceability data for cropId: {}", cropId);
        CropBatchTraceDTO trace = cropService.getCropTraceability(cropId);
        return ApiResponse.success(trace);
    }
}
