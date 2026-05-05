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

        if (!isAuthenticated(auth)) {
            return "redirect:/auth/login";
        }

        String email = auth.getName();
        logger.info("Dashboard redirect for user: {}", email);

        if (hasRole(auth, Role.ADMIN)) {
            return "redirect:/admin/dashboard";
        }

        if (hasRole(auth, Role.FARMER)) {
            return "redirect:/farmer/dashboard";
        }

        if (hasRole(auth, Role.BUYER)) {
            return "redirect:/buyer/dashboard";
        }

        logger.error("Unknown role for user: {}", email);
        throw new IllegalStateException("Unknown role for user");
    }

    // ================== HELPERS ==================

    private boolean isAuthenticated(Authentication auth) {
        return auth != null &&
               auth.isAuthenticated() &&
               !"anonymousUser".equals(auth.getName());
    }

    private boolean hasRole(Authentication auth, Role role) {
        return auth.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role.name()));
    }
}