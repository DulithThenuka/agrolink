package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.*;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.service.OrderService;

import java.security.Principal;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/logistics")
@PreAuthorize("hasAnyRole('LOGISTICS', 'LOGISTICS_PROVIDER', 'ADMIN')")
public class RestLogisticsController {

    private static final Logger logger = LoggerFactory.getLogger(RestLogisticsController.class);

    private final OrderService orderService;

    public RestLogisticsController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/available")
    public ApiResponse<PagedResponse<OrderDTO>> getAvailableDeliveries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.info("Fetching available logistics jobs");
        Page<OrderDTO> available = orderService.getAvailableDeliveries(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ApiResponse.success(toPagedResponse(available));
    }

    @PostMapping("/{id}/accept")
    public ApiResponse<OrderDTO> acceptDelivery(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        logger.info("Logistics driver {} accepting delivery for order {}", email, id);
        OrderDTO updated = orderService.driverAcceptDelivery(id, email);
        return ApiResponse.success("Delivery accepted successfully!", updated);
    }

    public static class UpdateStatusRequest {
        private OrderStatus status;
        private String notes;
        private Double lat;
        private Double lng;

        public OrderStatus getStatus() { return status; }
        public void setStatus(OrderStatus status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public Double getLat() { return lat; }
        public void setLat(Double lat) { this.lat = lat; }
        public Double getLng() { return lng; }
        public void setLng(Double lng) { this.lng = lng; }
    }

    @PostMapping("/{id}/status")
    public ApiResponse<OrderDTO> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request,
            Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        logger.info("Logistics driver {} updating order {} status to {}", email, id, request.getStatus());
        OrderDTO updated = orderService.updateDeliveryStatus(
                id, email, request.getStatus(), request.getNotes(), request.getLat(), request.getLng()
        );
        return ApiResponse.success("Fulfillment status updated successfully", updated);
    }

    @GetMapping("/my-jobs")
    public ApiResponse<PagedResponse<OrderDTO>> getMyJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        String email = normalizeEmail(principal.getName());
        Page<OrderDTO> jobs = orderService.getDriverOrders(
                email,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ApiResponse.success(toPagedResponse(jobs));
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
