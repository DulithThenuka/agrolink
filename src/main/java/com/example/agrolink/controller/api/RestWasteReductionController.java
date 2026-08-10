package com.example.agrolink.controller.api;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.WasteReductionDTO;
import com.example.agrolink.service.WasteReductionService;

@RestController
@RequestMapping("/api/v1/waste-reduction")
public class RestWasteReductionController {

    private static final Logger logger = LoggerFactory.getLogger(RestWasteReductionController.class);

    private final WasteReductionService wasteReductionService;

    public RestWasteReductionController(WasteReductionService wasteReductionService) {
        this.wasteReductionService = wasteReductionService;
    }

    @GetMapping("/analyze")
    public ApiResponse<WasteReductionDTO> analyzeRisk(
            @RequestParam(required = false, defaultValue = "Tomatoes") String cropName,
            @RequestParam(required = false, defaultValue = "500") Integer quantityKg,
            @RequestParam(required = false, defaultValue = "2") Integer daysToExpiry) {
        logger.info("REST request to analyze produce waste risk");
        WasteReductionDTO dto = wasteReductionService.analyzeCropWasteRisk(cropName, quantityKg, daysToExpiry);
        return ApiResponse.success("Produce risk analysis generated successfully", dto);
    }

    public static class ApplyDiscountRequest {
        private Long cropId;
        private double discountPct;

        public Long getCropId() { return cropId; }
        public void setCropId(Long cropId) { this.cropId = cropId; }
        public double getDiscountPct() { return discountPct; }
        public void setDiscountPct(double discountPct) { this.discountPct = discountPct; }
    }

    @PostMapping("/apply-discount")
    public ApiResponse<Map<String, Object>> applyDiscount(@RequestBody ApplyDiscountRequest request) {
        logger.info("REST request to apply dynamic price discount");
        Map<String, Object> res = wasteReductionService.applyDiscountAction(request.getCropId(), request.getDiscountPct());
        return ApiResponse.success("Discount applied successfully", res);
    }

    public static class DispatchOfferRequest {
        private String targetBuyerName;
        private String cropName;
        private int quantityKg;

        public String getTargetBuyerName() { return targetBuyerName; }
        public void setTargetBuyerName(String targetBuyerName) { this.targetBuyerName = targetBuyerName; }
        public String getCropName() { return cropName; }
        public void setCropName(String cropName) { this.cropName = cropName; }
        public int getQuantityKg() { return quantityKg; }
        public void setQuantityKg(int quantityKg) { this.quantityKg = quantityKg; }
    }

    @PostMapping("/dispatch-offer")
    public ApiResponse<Map<String, Object>> dispatchOffer(@RequestBody DispatchOfferRequest request) {
        logger.info("REST request to dispatch rescue offer");
        Map<String, Object> res = wasteReductionService.dispatchRescueOffer(
                request.getTargetBuyerName(),
                request.getCropName(),
                request.getQuantityKg()
        );
        return ApiResponse.success("Offer dispatched successfully", res);
    }

    public static class InitiateDonationRequest {
        private String foodBankName;
        private String cropName;
        private int quantityKg;

        public String getFoodBankName() { return foodBankName; }
        public void setFoodBankName(String foodBankName) { this.foodBankName = foodBankName; }
        public String getCropName() { return cropName; }
        public void setCropName(String cropName) { this.cropName = cropName; }
        public int getQuantityKg() { return quantityKg; }
        public void setQuantityKg(int quantityKg) { this.quantityKg = quantityKg; }
    }

    @PostMapping("/donate")
    public ApiResponse<Map<String, Object>> initiateDonation(@RequestBody InitiateDonationRequest request) {
        logger.info("REST request to initiate zero-waste donation");
        Map<String, Object> res = wasteReductionService.initiateDonation(
                request.getFoodBankName(),
                request.getCropName(),
                request.getQuantityKg()
        );
        return ApiResponse.success("Donation initiated successfully", res);
    }
}
