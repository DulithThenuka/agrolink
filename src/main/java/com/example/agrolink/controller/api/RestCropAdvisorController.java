package com.example.agrolink.controller.api;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.CropAdvisorRequestDTO;
import com.example.agrolink.dto.CropAdvisorResponseDTO;
import com.example.agrolink.service.CropAdvisorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/advisor")
public class RestCropAdvisorController {

    private final CropAdvisorService cropAdvisorService;

    public RestCropAdvisorController(CropAdvisorService cropAdvisorService) {
        this.cropAdvisorService = cropAdvisorService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<CropAdvisorResponseDTO>> analyzeCrop(@RequestBody CropAdvisorRequestDTO request) {
        CropAdvisorResponseDTO response = cropAdvisorService.analyze(request);
        return ResponseEntity.ok(ApiResponse.success("AI Crop analysis completed successfully", response));
    }
}
