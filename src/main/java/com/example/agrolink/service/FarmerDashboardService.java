package com.example.agrolink.service;

import com.example.agrolink.dto.FarmerDashboardDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FarmerDashboardService {

    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public FarmerDashboardService(CropRepository cropRepository,
                                  OrderRepository orderRepository,
                                  UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public FarmerDashboardDTO getFarmerDashboard(String email) {
        User farmer = userRepository.findByEmailIgnoreCase(email).orElse(null);

        long activeCropsCount = 6;
        long pendingOrdersCount = 12;
        BigDecimal expectedRevenue = new BigDecimal("248000");

        List<FarmerDashboardDTO.LowStockAlert> lowStockAlerts = new ArrayList<>();
        lowStockAlerts.add(new FarmerDashboardDTO.LowStockAlert("Red Tomatoes (Batch A)", 12));
        lowStockAlerts.add(new FarmerDashboardDTO.LowStockAlert("Green Chillies (Section B)", 8));

        List<FarmerDashboardDTO.CropBenchmark> benchmarks = new ArrayList<>();
        benchmarks.add(new FarmerDashboardDTO.CropBenchmark("Samba Rice", 210.0, 240.0, "High 🔥"));
        benchmarks.add(new FarmerDashboardDTO.CropBenchmark("Red Tomatoes", 160.0, 185.0, "High 🔥"));
        benchmarks.add(new FarmerDashboardDTO.CropBenchmark("Potatoes", 220.0, 240.0, "Moderate"));
        benchmarks.add(new FarmerDashboardDTO.CropBenchmark("Green Chillies", 350.0, 390.0, "High 🔥"));

        LocalDateTime now = LocalDateTime.now();
        List<OrderSummaryDTO> recentOrders = List.of(
            new OrderSummaryDTO(101L, "Samba Rice (100 Kg)", 1L, 100, "buyer1@example.com", "PENDING", "Pending Shipment", false, now.minusHours(2)),
            new OrderSummaryDTO(102L, "Red Tomatoes (50 Kg)", 2L, 50, "hotel_colombo@trade.com", "CONFIRMED", "Confirmed", true, now.minusHours(5)),
            new OrderSummaryDTO(103L, "Nuwara Eliya Potatoes", 3L, 200, "retail_super@market.lk", "DELIVERED", "Delivered", true, now.minusDays(1))
        );

        String farmerDisplayName = (farmer != null && farmer.getEmail() != null)
                ? farmer.getEmail().split("@")[0]
                : "Farmer";

        return new FarmerDashboardDTO(
            farmerDisplayName,
            87, // Farm Health Score
            activeCropsCount,
            expectedRevenue,
            pendingOrdersCount,
            "Low",     // Weather Risk
            "Medium",  // Disease Risk
            "High",    // Market Demand
            lowStockAlerts,
            benchmarks,
            recentOrders
        );
    }
}
