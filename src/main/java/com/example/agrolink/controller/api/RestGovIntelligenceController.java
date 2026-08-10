package com.example.agrolink.controller.api;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.GovIntelligenceDTO;
import com.example.agrolink.service.GovIntelligenceService;

@RestController
@RequestMapping("/api/v1/gov-intelligence")
public class RestGovIntelligenceController {

    private static final Logger logger = LoggerFactory.getLogger(RestGovIntelligenceController.class);

    private final GovIntelligenceService govIntelligenceService;

    public RestGovIntelligenceController(GovIntelligenceService govIntelligenceService) {
        this.govIntelligenceService = govIntelligenceService;
    }

    @GetMapping("/overview")
    public ApiResponse<GovIntelligenceDTO> getNationalOverview() {
        logger.info("REST request for Sri Lanka National Agricultural Overview");
        GovIntelligenceDTO overview = govIntelligenceService.getNationalAgriculturalOverview();
        return ApiResponse.success("Sri Lanka Agricultural Overview fetched successfully", overview);
    }

    public static class PolicySimulateRequest {
        private double importTariffChangePct;
        private double storageSubsidyLkrPerKg;
        private double fertilizerSubsidyPct;

        public double getImportTariffChangePct() { return importTariffChangePct; }
        public void setImportTariffChangePct(double importTariffChangePct) { this.importTariffChangePct = importTariffChangePct; }
        public double getStorageSubsidyLkrPerKg() { return storageSubsidyLkrPerKg; }
        public void setStorageSubsidyLkrPerKg(double storageSubsidyLkrPerKg) { this.storageSubsidyLkrPerKg = storageSubsidyLkrPerKg; }
        public double getFertilizerSubsidyPct() { return fertilizerSubsidyPct; }
        public void setFertilizerSubsidyPct(double fertilizerSubsidyPct) { this.fertilizerSubsidyPct = fertilizerSubsidyPct; }
    }

    @PostMapping("/simulate")
    public ApiResponse<Map<String, Object>> simulatePolicyImpact(@RequestBody PolicySimulateRequest request) {
        logger.info("REST request to simulate policy impact");
        Map<String, Object> result = govIntelligenceService.simulatePolicyImpact(
                request.getImportTariffChangePct(),
                request.getStorageSubsidyLkrPerKg(),
                request.getFertilizerSubsidyPct()
        );
        return ApiResponse.success("Policy impact simulated successfully", result);
    }
}
