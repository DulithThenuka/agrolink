package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.*;
import com.example.agrolink.service.AdminService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import com.example.agrolink.service.OrderService;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class RestAdminController {

    private static final Logger logger = LoggerFactory.getLogger(RestAdminController.class);

    private final AdminService adminService;
    private final OrderService orderService;

    public RestAdminController(AdminService adminService, OrderService orderService) {
        this.adminService = adminService;
        this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardDTO> getDashboard() {
        logger.info("REST Load admin dashboard");
        AdminDashboardDTO data = adminService.getDashboardData();
        return ApiResponse.success(data);
    }

    @GetMapping("/escrow/disputed")
    public ApiResponse<PagedResponse<OrderDTO>> getDisputedEscrows(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Admin fetching disputed escrow orders");
        Page<OrderDTO> disputed = orderService.getDisputedOrders(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ApiResponse.success(toPagedResponse(disputed));
    }

    public static class ResolveDisputeRequest {
        private String decision; // "RELEASE" or "REFUND"
        private String notes;

        public String getDecision() { return decision; }
        public void setDecision(String decision) { this.decision = decision; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    @PostMapping("/escrow/{id}/resolve")
    public ApiResponse<OrderDTO> resolveEscrowDispute(
            @PathVariable Long id,
            @RequestBody ResolveDisputeRequest request,
            Principal principal) {
        String adminEmail = principal != null ? principal.getName() : "admin@agrolink.com";
        logger.info("Admin {} resolving escrow dispute for order {} with decision {}", adminEmail, id, request.getDecision());
        OrderDTO resolved = orderService.resolveDisputeByAdmin(id, request.getDecision(), request.getNotes());
        return ApiResponse.success("Escrow dispute resolved successfully!", resolved);
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
