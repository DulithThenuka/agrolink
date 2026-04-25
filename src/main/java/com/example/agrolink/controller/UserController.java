package com.example.agrolink.controller;

import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.service.UserService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterDTO dto) {

        logger.info("API registration request for email: {}", dto.getEmail());

        try {
            UserDTO user = userService.register(dto);

            return ResponseEntity.status(HttpStatus.CREATED).body(user);

        } catch (IllegalArgumentException ex) {

            logger.warn("Registration failed: {}", ex.getMessage());

            return ResponseEntity.badRequest().body(
                    new ApiResponse(false, ex.getMessage())
            );
        }
    }
}