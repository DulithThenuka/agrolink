package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.*;
import com.example.agrolink.service.OrderService;

import jakarta.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/orders")
public class RestOrderController {

    private static final Logger logger = LoggerFactory.getLogger(RestOrderController.class);

    private final OrderService orderService;

    public RestOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ApiResponse<OrderDTO> placeOrder(@Valid @RequestBody OrderRequestDTO dto, Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        logger.info("REST Order placement by user: {}", email);
        OrderDTO created = orderService.placeOrder(email, dto.getCropId(), dto.getQuantity());
        return ApiResponse.success("Order placed successfully", created);
    }

    @GetMapping("/my")
    public ApiResponse<PagedResponse<OrderDTO>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {

        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        logger.info("REST Fetching orders for user: {}", email);
        Page<OrderDTO> orderPage = orderService.getUserOrders(
                email,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );

        return ApiResponse.success(toPagedResponse(orderPage));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderDTO> getOrderById(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        logger.info("REST Fetching order details: {} for user: {}", id, email);
        OrderDTO order = orderService.getOrderById(id, email);
        return ApiResponse.success(order);
    }

    @PostMapping("/{id}/farmer-accept")
    public ApiResponse<OrderDTO> farmerAcceptOrder(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        logger.info("Farmer {} accepting order {}", email, id);
        OrderDTO updated = orderService.farmerAcceptOrder(id, email);
        return ApiResponse.success("Order accepted and transport requested", updated);
    }

    @PostMapping("/{id}/buyer-confirm")
    public ApiResponse<OrderDTO> buyerConfirmDelivery(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        logger.info("Buyer {} confirming delivery for order {}", email, id);
        OrderDTO updated = orderService.buyerConfirmDelivery(id, email);
        return ApiResponse.success("Delivery confirmed! Farmer has been paid.", updated);
    }

    @GetMapping("/farmer")
    public ApiResponse<PagedResponse<OrderDTO>> getFarmerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        Page<OrderDTO> orderPage = orderService.getFarmerOrders(
                email,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ApiResponse.success(toPagedResponse(orderPage));
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.toLowerCase().trim();
    }

    private <T> PagedResponse<T> toPagedResponse(Page<T> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
