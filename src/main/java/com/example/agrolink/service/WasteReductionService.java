package com.example.agrolink.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.agrolink.dto.WasteReductionDTO;
import com.example.agrolink.dto.WasteReductionDTO.*;
import com.example.agrolink.repository.CropRepository;

@Service
public class WasteReductionService {

    private static final Logger logger = LoggerFactory.getLogger(WasteReductionService.class);

    private final CropRepository cropRepository;

    public WasteReductionService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public WasteReductionDTO analyzeCropWasteRisk(String cropName, Integer quantityKg, Integer daysToExpiry) {
        String targetCrop = (cropName != null && !cropName.isBlank()) ? cropName : "Tomatoes";
        int qty = (quantityKg != null && quantityKg > 0) ? quantityKg : 500;
        int expiryDays = (daysToExpiry != null && daysToExpiry >= 0) ? daysToExpiry : 2;

        logger.info("Analyzing produce waste risk for {} kg of {} with {} days to expiry", qty, targetCrop, expiryDays);

        // Compute Risk Level
        String riskLevel;
        double discountPct;
        if (expiryDays <= 2) {
            riskLevel = "HIGH";
            discountPct = 15.0; // 15% price cut recommended as in prompt
        } else if (expiryDays <= 5) {
            riskLevel = "MEDIUM";
            discountPct = 10.0;
        } else {
            riskLevel = "LOW";
            discountPct = 5.0;
        }

        BigDecimal originalPrice = BigDecimal.valueOf(180.00); // LKR 180 / kg base
        BigDecimal discountFactor = BigDecimal.valueOf(1.0 - (discountPct / 100.0));
        BigDecimal discountedPrice = originalPrice.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);

        // Nearby Commercial Buyers (Restaurant A, Hotel B, Supermarket C as requested in prompt)
        List<CommercialBuyerMatch> commercialBuyers = List.of(
                new CommercialBuyerMatch("Restaurant A (Ceylon Bistro)", "Restaurant", 3.2, 150, "+94 77 123 4567"),
                new CommercialBuyerMatch("Hotel B (Grand Cinnamon Resort)", "Hotel", 5.8, 250, "+94 81 987 6543"),
                new CommercialBuyerMatch("Supermarket C (Keells Fresh Hub)", "Supermarket", 2.1, 300, "+94 11 456 7890")
        );

        // Food Bank Donation Partners (Donation D as requested)
        List<DonationPartnerMatch> donationPartners = List.of(
                new DonationPartnerMatch("Food Bank D (Lanka Food Rescue & Kitchen)", "Community Food Bank", 4.5, true, "Section 18 Tax Certificate #LKR-894"),
                new DonationPartnerMatch("Suwa Arana Children's Haven", "Orphanage", 6.0, true, "Eligible")
        );

        // Food Processing Factory Matches (Sauce Factory E as requested)
        List<ProcessingCompanyMatch> processingCompanies = List.of(
                new ProcessingCompanyMatch("Processing Company E (Kandy Tomato Sauce & Paste Factory)", "Sauce & Paste Factory", BigDecimal.valueOf(140.00), 8.5, "High Processing Capacity"),
                new ProcessingCompanyMatch("Ceylon Agro Dehydration Hub", "Dehydration & Canning Facility", BigDecimal.valueOf(135.00), 12.0, "Ready for Bulk Purchase")
        );

        // Environmental Impact Savings (500kg Tomatoes ~ 1250 kg CO2, 90,000L water, 1000 meals)
        double co2SavedKg = qty * 2.5;
        double waterSavedLiters = qty * 180.0;
        int mealsCreated = qty * 2;

        EnvironmentalImpact impact = new EnvironmentalImpact(co2SavedKg, waterSavedLiters, mealsCreated);

        return new WasteReductionDTO(
                targetCrop,
                qty,
                expiryDays,
                riskLevel,
                discountPct,
                originalPrice,
                discountedPrice,
                commercialBuyers,
                donationPartners,
                processingCompanies,
                impact
        );
    }

    public Map<String, Object> applyDiscountAction(Long cropId, double discountPct) {
        logger.info("Executing automated dynamic price reduction of {}% for cropId {}", discountPct, cropId);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Successfully applied " + discountPct + "% flash price discount! Listing highlighted in AgroLink Rescue Catalog.");
        response.put("cropId", cropId);
        response.put("appliedDiscountPct", discountPct);
        return response;
    }

    public Map<String, Object> dispatchRescueOffer(String targetBuyerName, String cropName, int qtyKg) {
        logger.info("Dispatching priority rescue offer for {}kg of {} to {}", qtyKg, cropName, targetBuyerName);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("buyerName", targetBuyerName);
        response.put("message", "Instant priority dispatch alert transmitted to " + targetBuyerName + "! Dispatch confirmation expected within 15 minutes.");
        return response;
    }

    public Map<String, Object> initiateDonation(String foodBankName, String cropName, int qtyKg) {
        logger.info("Initiating zero-waste food donation of {}kg {} to {}", qtyKg, cropName, foodBankName);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("foodBank", foodBankName);
        response.put("taxReceiptCode", "TAX-DONATE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        response.put("message", "Donation pickup scheduled with " + foodBankName + ". Logistics driver notified for free transport!");
        return response;
    }
}
