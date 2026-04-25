package com.example.agrolink.controller;

import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.service.UserService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new UserRegisterDTO());
        return "register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("user") UserRegisterDTO userDTO,
                           BindingResult result,
                           Model model) {

        logger.info("Registration attempt for email: {}", userDTO.getEmail());

        // 🔥 Service-level validation
        try {
            service.register(userDTO);
        } catch (IllegalArgumentException ex) {

            logger.warn("Registration failed for {}: {}", userDTO.getEmail(), ex.getMessage());

            result.rejectValue("email", "error.user", ex.getMessage());
        }

        if (result.hasErrors()) {
            return "register";
        }

        logger.info("User registered successfully: {}", userDTO.getEmail());

        return "redirect:/auth/login?registered=true";
    }

    @GetMapping("/login")
    public String login(@RequestParam(value = "registered", required = false) String registered,
                        @RequestParam(value = "error", required = false) String error,
                        Model model) {

        if (registered != null) {
            model.addAttribute("successMessage", "Registration successful. Please login.");
        }

        if (error != null) {
            model.addAttribute("errorMessage", "Invalid email or password.");
        }

        return "login";
    }
}