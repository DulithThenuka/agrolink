package com.example.agrolink.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/crops";
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication auth) {

        String role = auth.getAuthorities().iterator().next().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            return "redirect:/admin/dashboard";
        } else if (role.equals("ROLE_FARMER")) {
            return "redirect:/farmer/dashboard";
        } else {
            return "redirect:/buyer/dashboard";
        }
    }
}