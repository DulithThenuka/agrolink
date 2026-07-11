package com.example.agrolink.controller;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.agrolink.dto.OrderRequestDTO;
import com.example.agrolink.service.OrderService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/orders")
@PreAuthorize("hasRole('BUYER')")
public class OrderController {

    private static final Logger logger =
            LoggerFactory.getLogger(
                    OrderController.class
            );

    private static final int PAGE_SIZE = 10;

    private final OrderService orderService;

    public OrderController(
            OrderService orderService) {

        this.orderService =
                orderService;
    }

    // ================== PLACE ORDER ==================

    @PostMapping("/place")
    public String placeOrder(

            @Valid
            @ModelAttribute("order")
            OrderRequestDTO dto,

            BindingResult result,

            Principal principal,

            Model model) {

        if (principal == null) {

            return "redirect:/auth/login";
        }

        if (result.hasErrors()) {

            return "redirect:/crops?error=validation";
        }

        String email =
                normalizeEmail(
                        principal.getName()
                );

        logger.info(
                "Order attempt by user: {}",
                email
        );

        try {

            orderService.placeOrder(
                    email,
                    dto.getCropId(),
                    dto.getQuantity()
            );

        } catch (
                IllegalArgumentException ex
        ) {

            logger.warn(
                    "Order failed: {}",
                    ex.getMessage()
            );

            return "redirect:/crops?error=true";
        }

        return "redirect:/orders/my?success=true";
    }

    // ================== MY ORDERS ==================

    @GetMapping("/my")
    public String myOrders(
            @RequestParam(value = "success", required = false) String success,
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "payment", required = false) String payment,
            Model model,
            Principal principal) {

        if (principal == null) {

            return "redirect:/auth/login";
        }

        String email =
                normalizeEmail(
                        principal.getName()
                );

        logger.info(
                "Fetching orders for user: {}",
                email
        );

        if (success != null) {
            model.addAttribute("successMessage", "Order placed successfully! Please complete your payment.");
        }
        if (error != null) {
            if ("unauthorized".equals(error)) {
                model.addAttribute("errorMessage", "You are not authorized to view that order.");
            } else {
                model.addAttribute("errorMessage", "An error occurred with your order.");
            }
        }
        if (payment != null) {
            if ("success".equals(payment)) {
                model.addAttribute("successMessage", "Payment completed successfully! Your order is confirmed.");
            } else if ("cancel".equals(payment)) {
                model.addAttribute("errorMessage", "Payment was cancelled.");
            }
        }

        model.addAttribute(
                "orders",
                orderService.getUserOrders(
                        email,
                        PageRequest.of(
                                0,
                                PAGE_SIZE,
                                Sort.by(
                                        "createdAt"
                                ).descending()
                        )
                )
        );

        return "pages/orders/list";
    }

    // ================== ORDER DETAILS ==================

    @GetMapping("/{id}")
    public String orderDetails(
            @PathVariable("id") Long id,
            Model model,
            Principal principal) {

        if (principal == null) {
            return "redirect:/auth/login";
        }

        String email = normalizeEmail(principal.getName());
        logger.info("Fetching order details for order: {} by user: {}", id, email);

        try {
            com.example.agrolink.dto.OrderDTO order = orderService.getOrderById(id, email);
            model.addAttribute("order", order);
            return "pages/orders/details";
        } catch (IllegalArgumentException ex) {
            logger.warn("Unauthorized order access attempt: {}", ex.getMessage());
            return "redirect:/orders/my?error=unauthorized";
        } catch (Exception ex) {
            logger.error("Failed to load order details: {}", ex.getMessage());
            return "redirect:/orders/my?error=true";
        }
    }

    // ================== HELPERS ==================

    private String normalizeEmail(
            String email) {

        return email == null
                ? ""
                : email.toLowerCase()
                        .trim();
    }
}