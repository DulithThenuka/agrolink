package com.example.agrolink.service;

import com.example.agrolink.dto.AnalyticsDTO;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;

    public AnalyticsService(CropRepository cropRepository, OrderRepository orderRepository) {
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
    }

    public AnalyticsDTO getAnalyticsData() {
        long totalCrops = cropRepository.count();
        long totalOrders = orderRepository.count();

        // Calculate simulated / real metrics
        BigDecimal totalVolume = BigDecimal.valueOf(184050.00);
        double averageSavings = 34.2; // 34.2% saved via direct trade

        Map<String, Double> categories = new HashMap<>();
        categories.put("Vegetables", 42.5);
        categories.put("Grains & Cereals", 28.0);
        categories.put("Fruits", 18.5);
        categories.put("Spices & Plantation", 11.0);

        List<AnalyticsDTO.CommodityPrice> commodityPrices = List.of(
            new AnalyticsDTO.CommodityPrice("Samba Rice (Kg)", 220.00, +2.4, "UP"),
            new AnalyticsDTO.CommodityPrice("Red Tomatoes (Kg)", 185.50, +5.1, "UP"),
            new AnalyticsDTO.CommodityPrice("Nuwara Eliya Potatoes (Kg)", 240.00, -1.2, "DOWN"),
            new AnalyticsDTO.CommodityPrice("Sweet Corn (Kg)", 140.00, 0.0, "STABLE"),
            new AnalyticsDTO.CommodityPrice("Green Chillies (Kg)", 390.00, +8.3, "UP")
        );

        return new AnalyticsDTO(
            totalVolume,
            totalCrops,
            totalOrders,
            averageSavings,
            categories,
            commodityPrices
        );
    }
}
