package com.example.agrolink.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;
import com.example.agrolink.service.UserService;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute User user) {
        user.setRole(Role.BUYER); // ✅ FIX
        service.register(user);
        return "redirect:/auth/login";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
    @GetMapping("/dashboard")
public String dashboard() {
    return "dashboard";
}

@GetMapping("/home")
public String home() {
    return "home"; // create home.html
}
}