package com.example.agrolink.controller;

import com.example.agrolink.dto.OrderRequestDTO;
import com.example.agrolink.entity.User;
import com.example.agrolink.service.OrderService;
import com.example.agrolink.service.UserService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequestMapping("/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService,
                           UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    // ================== PLACE ORDER ==================
    @PostMapping("/place")
    @PreAuthorize("hasRole('BUYER')")
    public String placeOrder(@Valid @ModelAttribute("order") OrderRequestDTO dto,
                             Principal principal) {

        String email = principal.getName().toLowerCase().trim();
        logger.info("Order attempt by user: {}", email);

        User buyer = userService.findByEmail(email);

        orderService.placeOrder(buyer, dto.getCropId(), dto.getQuantity());

        return "redirect:/orders/my?success=true";
    }

    // ================== VIEW ORDERS ==================
    @GetMapping("/my")
    @PreAuthorize("hasRole('BUYER')")
    public String myOrders(org.springframework.ui.Model model,
                           Principal principal) {

        String email = principal.getName().toLowerCase().trim();
        logger.info("Fetching orders for user: {}", email);

        User buyer = userService.findByEmail(email);

        model.addAttribute("orders", orderService.getUserOrders(buyer));

        return "my-orders";
    }
}