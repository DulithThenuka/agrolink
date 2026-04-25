package com.example.agrolink.controller;

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
        logger.info("User {} accessing dashboard redirect", email);

        if (hasRole(auth, "ROLE_ADMIN")) {
            return "redirect:/admin/dashboard";
        } 
        if (hasRole(auth, "ROLE_FARMER")) {
            return "redirect:/farmer/dashboard";
        }

        return "redirect:/buyer/dashboard";
    }

    private boolean hasRole(Authentication auth, String role) {
        return auth.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals(role));
    }
}