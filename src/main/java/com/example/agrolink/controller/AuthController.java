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

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ================== REGISTER PAGE ==================

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new UserRegisterDTO());
        return "register";
    }

    // ================== REGISTER ==================

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("user") UserRegisterDTO userDTO,
                           BindingResult result,
                           Model model) {

        logger.info("Registration attempt for email: {}", userDTO.getEmail());

        if (result.hasErrors()) {
            return "register";
        }

        try {
            userService.register(userDTO);
        } catch (IllegalArgumentException ex) {
            logger.warn("Registration failed: {}", ex.getMessage());
            result.rejectValue("email", "error.user", ex.getMessage());
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
public ResponseEntity<?> apiLogin(@Valid @RequestBody LoginRequestDTO request) {

    try {
        String email = normalizeEmail(request.getEmail());

        User user = userService.findByEmail(email);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return unauthorizedResponse();
        }

        String role = user.getRole().name(); // ✅ FIX

        String token = jwtUtil.generateToken(
                user.getEmail(),
                role
        );

        long expiresIn = 3600;

        logger.info("User logged in: {}", user.getEmail());

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        new AuthResponseDTO(
                                token,
                                user.getEmail(),
                                role, // ✅ FIX
                                expiresIn
                        )
                )
        );

    } catch (Exception ex) {
        logger.warn("Login failed: {}", ex.getMessage());
        return unauthorizedResponse();
    }
}

    // ================== HELPERS ==================

    private String normalizeEmail(String email) {
        return email == null ? "" : email.toLowerCase().trim();
    }

    private ResponseEntity<ApiResponse<?>> unauthorizedResponse() {
        return ResponseEntity.status(401)
                .body(ApiResponse.error("Invalid credentials"));
    }
}