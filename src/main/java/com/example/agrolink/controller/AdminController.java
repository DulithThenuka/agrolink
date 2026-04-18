package com.example.agrolink.controller;

import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;

    public AdminController(UserRepository userRepository,
                           CropRepository cropRepository,
                           OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/admin/dashboard")
    public String dashboard(Model model) {

        long totalUsers = userRepository.count();
        long totalCrops = cropRepository.count();
        long totalOrders = orderRepository.count();

        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("totalCrops", totalCrops);
        model.addAttribute("totalOrders", totalOrders);

        model.addAttribute("recentOrders",
                orderRepository.findAll().stream().limit(5).toList());

        return "admin-dashboard";
    }
}