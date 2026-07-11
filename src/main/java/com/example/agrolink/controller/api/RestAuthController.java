package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.*;
import com.example.agrolink.entity.User;
import com.example.agrolink.service.UserService;
import com.example.agrolink.util.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class RestAuthController {

    private static final Logger logger = LoggerFactory.getLogger(RestAuthController.class);

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public RestAuthController(UserService userService,
                              JwtUtil jwtUtil,
                              PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        logger.info("REST Login attempt for email: {}", request.getEmail());
        String email = normalizeEmail(request.getEmail());
        User user = userService.findByEmail(email);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid credentials");
        }

        String role = user.getRole().name();
        String token = jwtUtil.generateToken(user.getEmail(), role);
        long expiresIn = 3600;

        logger.info("REST Login successful for: {}", user.getEmail());
        return ApiResponse.success("Login successful", new AuthResponseDTO(token, user.getEmail(), role, expiresIn));
    }

    @PostMapping("/register")
    public ApiResponse<UserDTO> register(@Valid @RequestBody UserRegisterDTO userDTO) {
        logger.info("REST Registration attempt for email: {}", userDTO.getEmail());
        UserDTO user = userService.register(userDTO);
        return ApiResponse.success("Registration successful", user);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return ApiResponse.success("Logged out successfully");
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.toLowerCase().trim();
    }
}
