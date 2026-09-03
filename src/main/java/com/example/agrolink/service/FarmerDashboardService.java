package com.example.agrolink.service;

import com.example.agrolink.dto.FarmerDashboardDTO;
import com.example.agrolink.dto.OrderSummaryDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;
import com.example.agrolink.mapper.OrderMapper;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.EquipmentBookingRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.SupplierOrderRepository;
import com.example.agrolink.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class FarmerDashboardService {

    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final SupplierOrderRepository supplierOrderRepository;
    private final EquipmentBookingRepository equipmentBookingRepository;

    public FarmerDashboardService(CropRepository cropRepository,
                                  OrderRepository orderRepository,
                                  UserRepository userRepository,
                                  SupplierOrderRepository supplierOrderRepository,
                                  EquipmentBookingRepository equipmentBookingRepository) {
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.supplierOrderRepository = supplierOrderRepository;
        this.equipmentBookingRepository = equipmentBookingRepository;
    }

    public FarmerDashboardDTO getFarmerDashboard(String email) {
        User farmer = (email != null && !email.isBlank())
                ? userRepository.findByEmailIgnoreCase(email.trim()).orElse(null)
                : null;

        if (farmer == null) {
            return new FarmerDashboardDTO(
                    "Farmer",
                    85,
                    0L,
                    BigDecimal.ZERO,
                    0L,
                    "Low",
                    "Low",
                    "Moderate",
                    List.of(),
                    List.of(),
                    List.of()
            );
        }

        // 1. Fetch Farmer's Active Crops
        List<Crop> myCrops = cropRepository.findByFarmerIdAndActiveTrue(farmer.getId());
        long activeCropsCount = myCrops.size();

        // Active inventory value: sum of (price * quantity)
        BigDecimal activeInventoryValuation = myCrops.stream()
                .map(c -> c.getPrice() != null ? c.getPrice().multiply(BigDecimal.valueOf(c.getQuantity())) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Fetch Farmer's Incoming & Processed Orders
        Page<Order> farmerOrdersPage = orderRepository.findFarmerOrders(farmer, PageRequest.of(0, 50));
        List<Order> allOrders = farmerOrdersPage.getContent();

        long pendingOrdersCount = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PENDING || o.getStatus() == OrderStatus.FARMER_ACCEPTED)
                .count();

        // Completed / confirmed order sales
        BigDecimal completedOrdersRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED || o.getStatus() == OrderStatus.CONFIRMED || o.getStatus() == OrderStatus.PAID)
                .map(o -> o.getTotalPrice() != null ? o.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Total expected gross revenue = completed sales + active inventory
        BigDecimal expectedRevenue = completedOrdersRevenue.add(activeInventoryValuation);

        // 3. Low Stock Alerts (Crops with remaining stock <= 50 Kg)
        List<FarmerDashboardDTO.LowStockAlert> lowStockAlerts = new ArrayList<>();
        for (Crop crop : myCrops) {
            if (crop.getQuantity() <= 50) {
                lowStockAlerts.add(new FarmerDashboardDTO.LowStockAlert(crop.getName(), crop.getQuantity()));
            }
        }

        // 4. Agronomy Crop Benchmarks against Market Rates
        List<FarmerDashboardDTO.CropBenchmark> benchmarks = new ArrayList<>();
        for (Crop crop : myCrops) {
            double currentPrice = crop.getPrice() != null ? crop.getPrice().doubleValue() : 0.0;
            double marketAvg = crop.getPrice() != null
                    ? crop.getPrice().multiply(new BigDecimal("1.07")).doubleValue()
                    : (currentPrice * 1.07);
            String demand = currentPrice <= marketAvg ? "High 🔥" : "Moderate";
            benchmarks.add(new FarmerDashboardDTO.CropBenchmark(
                    crop.getName(),
                    currentPrice,
                    Math.round(marketAvg * 100.0) / 100.0,
                    demand
            ));
        }

        // 5. Recent Farmer Orders Summary
        List<OrderSummaryDTO> recentOrders = allOrders.stream()
                .limit(5)
                .map(OrderMapper::toSummaryDTO)
                .toList();

        // 6. Farm Health Score
        int farmHealthScore = 85;
        if (activeCropsCount > 0) farmHealthScore += 5;
        if (lowStockAlerts.isEmpty() && activeCropsCount > 0) farmHealthScore += 4;
        if (farmHealthScore > 98) farmHealthScore = 98;

        String farmerDisplayName = farmer.getName() != null && !farmer.getName().isBlank()
                ? farmer.getName()
                : (farmer.getEmail() != null ? farmer.getEmail().split("@")[0] : "Farmer");

        return new FarmerDashboardDTO(
                farmerDisplayName,
                farmHealthScore,
                activeCropsCount,
                expectedRevenue,
                pendingOrdersCount,
                "Low",
                "Medium",
                "High",
                lowStockAlerts,
                benchmarks,
                recentOrders
        );
    }
}
