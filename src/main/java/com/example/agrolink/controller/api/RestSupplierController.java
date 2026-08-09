package com.example.agrolink.controller.api;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.SupplierItemDTO;
import com.example.agrolink.dto.SupplierOrderDTO;
import com.example.agrolink.service.SupplierMarketplaceService;

@RestController
@RequestMapping("/api/v1/suppliers")
public class RestSupplierController {

    private static final Logger logger = LoggerFactory.getLogger(RestSupplierController.class);

    private final SupplierMarketplaceService supplierService;

    public RestSupplierController(SupplierMarketplaceService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping("/items")
    public ApiResponse<List<SupplierItemDTO>> getItems(@RequestParam(required = false) String category) {
        logger.info("REST Fetching supplier marketplace items, category: {}", category);
        List<SupplierItemDTO> items = supplierService.getItems(category);
        return ApiResponse.success(items);
    }

    @PostMapping("/items")
    public ApiResponse<SupplierItemDTO> createItem(@AuthenticationPrincipal String email,
                                                    @RequestBody SupplierItemDTO dto) {
        logger.info("REST Supplier {} creating new item: {}", email, dto.getName());
        SupplierItemDTO created = supplierService.createItem(dto, email);
        return ApiResponse.success(created);
    }

    @PostMapping("/items/{id}/purchase")
    public ApiResponse<SupplierOrderDTO> purchaseItem(@PathVariable Long id,
                                                      @RequestParam(defaultValue = "1") int quantity,
                                                      @AuthenticationPrincipal String email) {
        logger.info("REST Farmer {} purchasing supplier item ID: {}, Qty: {}", email, id, quantity);
        String farmerEmail = (email != null && !email.isBlank()) ? email : "farmer@agrolink.com";
        String farmerName = farmerEmail.contains("@") ? farmerEmail.split("@")[0] : farmerEmail;
        SupplierOrderDTO order = supplierService.purchaseItem(id, quantity, farmerEmail, farmerName);
        return ApiResponse.success(order);
    }

    @GetMapping("/orders/farmer")
    public ApiResponse<List<SupplierOrderDTO>> getFarmerOrders(@AuthenticationPrincipal String email) {
        String farmerEmail = (email != null && !email.isBlank()) ? email : "farmer@agrolink.com";
        List<SupplierOrderDTO> orders = supplierService.getFarmerOrders(farmerEmail);
        return ApiResponse.success(orders);
    }

    @GetMapping("/orders/supplier")
    public ApiResponse<List<SupplierOrderDTO>> getSupplierOrders(@AuthenticationPrincipal String email) {
        String supplierEmail = (email != null && !email.isBlank()) ? email : "supplier@agrolink.com";
        List<SupplierOrderDTO> orders = supplierService.getSupplierOrders(supplierEmail);
        return ApiResponse.success(orders);
    }
}
