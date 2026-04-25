package com.example.agrolink.controller;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.example.agrolink.dto.OrderRequestDTO;
import com.example.agrolink.entity.User;
import com.example.agrolink.service.OrderService;
import com.example.agrolink.service.UserService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    // ✅ PLACE ORDER
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/place")
    public String placeOrder(@Valid @ModelAttribute("order") OrderRequestDTO dto,
                             BindingResult result,
                             Principal principal,
                             Model model) {

        if (principal == null) {
            return "redirect:/auth/login";
        }

        if (result.hasErrors()) {
            return "redirect:/crops?error=invalid_input";
        }

        String email = principal.getName();
        logger.info("Order attempt by user: {}", email);

        try {
            User buyer = userService.findByEmail(email);

            orderService.placeOrder(buyer, dto.getCropId(), dto.getQuantity());

            logger.info("Order placed successfully by {}", email);

            return "redirect:/orders/my?success=true";

        } catch (IllegalArgumentException ex) {

            logger.warn("Order failed for {}: {}", email, ex.getMessage());
            return "redirect:/crops?error=" + ex.getMessage();

        } catch (Exception ex) {

            logger.error("Unexpected error during order placement", ex);
            return "redirect:/crops?error=system_error";
        }
    }

    // ✅ VIEW USER ORDERS
    @PreAuthorize("hasRole('BUYER')")
    @GetMapping("/my")
    public String myOrders(Model model, Principal principal) {

        if (principal == null) {
            return "redirect:/auth/login";
        }

        String email = principal.getName();
        logger.info("Fetching orders for user: {}", email);

        User buyer = userService.findByEmail(email);

        model.addAttribute("orders", orderService.getUserOrders(buyer));

        return "my-orders";
    }
}