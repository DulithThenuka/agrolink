package com.example.agrolink.controller;

import java.security.Principal;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.agrolink.entity.User;
import com.example.agrolink.service.OrderService;
import com.example.agrolink.service.UserService;

@Controller
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/place")
public String placeOrder(@RequestParam Long cropId,
                         @RequestParam int quantity,
                         Principal principal) {

    if (quantity <= 0) {
        return "redirect:/crops?error=invalid_quantity";
    }

    User buyer = userService.findByEmail(principal.getName());

    try {
        orderService.placeOrder(buyer, cropId, quantity);
    } catch (Exception e) {
        return "redirect:/crops?error=order_failed";
    }

    return "redirect:/orders/my?success=true";
}

    @GetMapping("/my")
    public String myOrders(Model model, Principal principal) {

        User buyer = userService.findByEmail(principal.getName());

        model.addAttribute("orders", orderService.getUserOrders(buyer));

        return "my-orders";
    }
}