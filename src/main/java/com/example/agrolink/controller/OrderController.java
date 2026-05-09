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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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

        return "my-orders";
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