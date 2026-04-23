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
    public String register(@Valid @ModelAttribute User user,
                           BindingResult result) {

        if (result.hasErrors()) {
            return "register";
        }

        if (service.existsByEmail(user.getEmail())) {
            return "redirect:/auth/register?error=email_exists";
        }

        if (user.getRole() == null) {
            user.setRole(Role.BUYER);
        }

        service.register(user);

        return "redirect:/auth/login?success=true";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}