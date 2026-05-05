package com.example.agrolink.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.UserDTO;
import com.example.agrolink.dto.UserRegisterDTO;
import com.example.agrolink.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger =
            LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ================== REGISTER ==================

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(
            @Valid @RequestBody UserRegisterDTO dto) {

        logger.info("API registration request received");

        try {

            UserDTO user = userService.register(dto);

            logger.info("User registered successfully: {}", user.getEmail());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(user);

        } catch (IllegalArgumentException ex) {

            logger.warn("Registration failed: {}", ex.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(ex.getMessage()));

        } catch (Exception ex) {

            logger.error("Unexpected registration error", ex);

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error"));
        }
    }
}