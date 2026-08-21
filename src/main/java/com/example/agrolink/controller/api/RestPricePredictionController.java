package com.example.agrolink.controller.api;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.PricePredictionResponseDTO;
import com.example.agrolink.service.PricePredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/price-prediction")
public class RestPricePredictionController {

    private final PricePredictionService pricePredictionService;

    public RestPricePredictionController(PricePredictionService pricePredictionService) {
        this.pricePredictionService = pricePredictionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PricePredictionResponseDTO>> getPrediction(
            @RequestParam(value = "crop", required = false, defaultValue = "Tomato") String crop,
            @RequestParam(value = "location", required = false, defaultValue = "Dambulla") String location,
            @RequestParam(value = "grade", required = false, defaultValue = "Grade B") String grade) {
        PricePredictionResponseDTO data = pricePredictionService.getPrediction(crop, location, grade);
        return ResponseEntity.ok(ApiResponse.success("AI Price prediction generated successfully", data));
    }
}
