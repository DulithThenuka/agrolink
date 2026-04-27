package com.example.agrolink.controller;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.service.UserService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ================== REGISTER ==================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterDTO dto) {

        logger.info("API registration request received");

        try {
            UserDTO user = userService.register(dto);

            logger.info("User registered successfully: {}", user.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(user);

        } catch (IllegalArgumentException ex) {

            logger.warn("Registration failed: {}", ex.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, ex.getMessage()));
        }
    }
}