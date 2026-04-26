package com.example.agrolink.controller;

import com.example.agrolink.dto.*;
import com.example.agrolink.entity.User;
import com.example.agrolink.service.UserService;
import com.example.agrolink.util.JwtUtil;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService service;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService service,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.service = service;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ================== REGISTER ==================

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

        try {
            service.register(userDTO);
        } catch (IllegalArgumentException ex) {
            logger.warn("Registration failed: {}", ex.getMessage());
            result.rejectValue("email", "error.user", ex.getMessage());
        }

        if (result.hasErrors()) {
            return "register";
        }

        return "redirect:/auth/login?registered=true";
    }

    // ================== LOGIN PAGE ==================

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

    // ================== JWT LOGIN ==================

    @PostMapping("/api/login")
    @ResponseBody
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {

        User user = service.findByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(
                new AuthResponseDTO(
                        token,
                        user.getEmail(),
                        user.getRole().name()
                )
        );
    }
}