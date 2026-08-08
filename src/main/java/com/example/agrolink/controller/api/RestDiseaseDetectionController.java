package com.example.agrolink.controller.api;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.DiseaseDetectionRequestDTO;
import com.example.agrolink.dto.DiseaseDetectionResponseDTO;
import com.example.agrolink.service.DiseaseDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/disease-detection")
public class RestDiseaseDetectionController {

    private final DiseaseDetectionService diseaseDetectionService;

    public RestDiseaseDetectionController(DiseaseDetectionService diseaseDetectionService) {
        this.diseaseDetectionService = diseaseDetectionService;
    }

    @PostMapping("/scan")
    public ResponseEntity<ApiResponse<DiseaseDetectionResponseDTO>> scanLeafImage(@RequestBody DiseaseDetectionRequestDTO request) {
        DiseaseDetectionResponseDTO response = diseaseDetectionService.analyze(request);
        return ResponseEntity.ok(ApiResponse.success("AI Leaf vision scan completed successfully", response));
    }
}
