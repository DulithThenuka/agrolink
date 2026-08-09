package com.example.agrolink.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.SupplierItemDTO;
import com.example.agrolink.dto.SupplierOrderDTO;
import com.example.agrolink.entity.SupplierItem;
import com.example.agrolink.entity.SupplierOrder;
import com.example.agrolink.repository.SupplierItemRepository;
import com.example.agrolink.repository.SupplierOrderRepository;

@Service
@Transactional
public class SupplierMarketplaceService {

    private static final Logger logger = LoggerFactory.getLogger(SupplierMarketplaceService.class);

    private final SupplierItemRepository itemRepository;
    private final SupplierOrderRepository orderRepository;

    public SupplierMarketplaceService(SupplierItemRepository itemRepository,
                                       SupplierOrderRepository orderRepository) {
        this.itemRepository = itemRepository;
        this.orderRepository = orderRepository;
        initSeedDataIfEmpty();
    }

    private void initSeedDataIfEmpty() {
        if (itemRepository.count() == 0) {
            logger.info("Initializing Supplier Marketplace default seed data...");
            createDefaultItem("F1 Hybrid Tomato Seeds (100g)", "Seeds", "AgroSeeds Lanka", "High-yield disease resistant hybrid seeds", new BigDecimal("3500.00"), 150, "https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e");
            createDefaultItem("NPK Organic Booster Fertilizer (50kg)", "Fertilizer", "Lanka Organic Tech", "Balanced nitrogen, phosphorus & potassium blend", new BigDecimal("12800.00"), 80, "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d");
            createDefaultItem("Bio-Shield Fungicide & Crop Spray (1L)", "Pesticides", "CropCare Global", "Eco-friendly protection against Solanaceae blight", new BigDecimal("4200.00"), 100, "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8");
            createDefaultItem("Professional Soil pH & Moisture Tester Meter", "Tools", "AgroTech Precision", "Digital dual-sensor probe for farm soil testing", new BigDecimal("6500.00"), 45, "https://images.unsplash.com/photo-1581092160607-ee22621dd758");
            createDefaultItem("Automated Solar Drip Irrigation Controller Kit", "Irrigation", "HydroFlow Lanka", "Smart drip irrigation valve controller with solar panel", new BigDecimal("28500.00"), 25, "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0");
            createDefaultItem("Multi-Purpose 15HP Diesel Power Tiller", "Machinery", "Lanka Agri Machines", "Heavy-duty 4-stroke power tiller with rotary blade attachment", new BigDecimal("485000.00"), 8, "https://images.unsplash.com/photo-1500937386664-56d1dfef3854");
        }
    }

    private void createDefaultItem(String name, String category, String brand, String description, BigDecimal price, int quantity, String imageUrl) {
        SupplierItem item = new SupplierItem();
        item.setName(name);
        item.setCategory(category);
        item.setSupplierEmail("supplier@agrolink.com");
        item.setSupplierName("Lanka Agri-Supply Ltd");
        item.setBrand(brand);
        item.setDescription(description);
        item.setPrice(price);
        item.setQuantity(quantity);
        item.setImageUrl(imageUrl);
        item.setActive(true);
        itemRepository.save(item);
    }

    @Transactional(readOnly = true)
    public List<SupplierItemDTO> getItems(String category) {
        List<SupplierItem> items;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
            items = itemRepository.findByCategoryIgnoreCaseAndActiveTrue(category);
        } else {
            items = itemRepository.findByActiveTrueOrderByCreatedAtDesc();
        }
        return items.stream().map(this::mapItemToDTO).collect(Collectors.toList());
    }

    public SupplierItemDTO createItem(SupplierItemDTO dto, String supplierEmail) {
        SupplierItem item = new SupplierItem();
        item.setName(dto.getName());
        item.setCategory(dto.getCategory() != null ? dto.getCategory() : "Seeds");
        item.setSupplierEmail(supplierEmail != null ? supplierEmail : "supplier@agrolink.com");
        item.setSupplierName(dto.getSupplierName() != null ? dto.getSupplierName() : "Agri-Supply Vendor");
        item.setBrand(dto.getBrand() != null ? dto.getBrand() : "AgroLink Certified");
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice() != null ? dto.getPrice() : new BigDecimal("1000.00"));
        item.setQuantity(dto.getQuantity() > 0 ? dto.getQuantity() : 50);
        item.setImageUrl(dto.getImageUrl());
        item.setActive(true);

        SupplierItem saved = itemRepository.save(item);
        return mapItemToDTO(saved);
    }

    public SupplierOrderDTO purchaseItem(Long itemId, int quantity, String farmerEmail, String farmerName) {
        SupplierItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Supplier item not found: " + itemId));

        if (item.getQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient inventory available");
        }

        item.setQuantity(item.getQuantity() - quantity);
        itemRepository.save(item);

        BigDecimal totalPrice = item.getPrice().multiply(new BigDecimal(quantity));

        SupplierOrder order = new SupplierOrder();
        order.setSupplierItem(item);
        order.setFarmerEmail(farmerEmail != null ? farmerEmail : "farmer@agrolink.com");
        order.setFarmerName(farmerName != null ? farmerName : "Farmer");
        order.setQuantity(quantity);
        order.setTotalPrice(totalPrice);
        order.setStatus("CONFIRMED");

        SupplierOrder saved = orderRepository.save(order);
        return mapOrderToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<SupplierOrderDTO> getFarmerOrders(String farmerEmail) {
        return orderRepository.findByFarmerEmailOrderByCreatedAtDesc(farmerEmail)
                .stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplierOrderDTO> getSupplierOrders(String supplierEmail) {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    private SupplierItemDTO mapItemToDTO(SupplierItem item) {
        return new SupplierItemDTO(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.getSupplierEmail(),
                item.getSupplierName(),
                item.getBrand(),
                item.getDescription(),
                item.getPrice(),
                item.getQuantity(),
                item.getImageUrl(),
                item.isActive()
        );
    }

    private SupplierOrderDTO mapOrderToDTO(SupplierOrder order) {
        return new SupplierOrderDTO(
                order.getId(),
                order.getSupplierItem().getId(),
                order.getSupplierItem().getName(),
                order.getSupplierItem().getCategory(),
                order.getSupplierItem().getSupplierEmail(),
                order.getFarmerEmail(),
                order.getFarmerName(),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getCreatedAt()
        );
    }
}
