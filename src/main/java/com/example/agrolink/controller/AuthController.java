package com.example.agrolink.controller;

import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.service.UserService;

import jakarta.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class AuthController {

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

        // validation errors
        if (result.hasErrors()) {
            return "register";
        }

        // email already exists
        if (service.existsByEmail(userDTO.getEmail())) {
            model.addAttribute("emailError", "Email already exists");
            return "register";
        }

        service.register(userDTO);

        return "redirect:/auth/login?success=true";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}