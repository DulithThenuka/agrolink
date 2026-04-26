package com.example.agrolink.controller;

import com.example.agrolink.entity.Role;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @GetMapping("/")
    public String home() {
        return "redirect:/crops";
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return "redirect:/auth/login";
        }

        String email = auth.getName();
        logger.info("Dashboard redirect for user: {}", email);

        if (hasRole(auth, Role.ADMIN.getAuthority())) {
            return "redirect:/admin/dashboard";
        }

        if (hasRole(auth, Role.FARMER.getAuthority())) {
            return "redirect:/farmer/dashboard";
        }

        if (hasRole(auth, Role.BUYER.getAuthority())) {
            return "redirect:/buyer/dashboard";
        }

        throw new IllegalStateException("Unknown role for user: " + email);
    }

    private boolean hasRole(Authentication auth, String role) {
        return auth.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals(role));
    }
}