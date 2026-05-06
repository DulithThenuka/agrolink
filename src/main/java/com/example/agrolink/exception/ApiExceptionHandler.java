package com.example.agrolink.exception;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.agrolink.dto.ApiResponse;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(ApiExceptionHandler.class);

    // ================== VALIDATION ==================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, List<String>>>>
    handleValidationErrors(MethodArgumentNotValidException ex) {

        Map<String, List<String>> errors = new LinkedHashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> {

                    errors.computeIfAbsent(
                            error.getField(),
                            k -> new ArrayList<>()
                    ).add(error.getDefaultMessage());
                });

        logger.warn("Validation failed: {}", errors);

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                errors
        );
    }

    // ================== BUSINESS ==================

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>>
    handleBusinessErrors(IllegalArgumentException ex) {

        logger.warn("Business error: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                null
        );
    }

    // ================== NOT FOUND ==================

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>>
    handleNotFound(ResourceNotFoundException ex) {

        logger.warn("Resource not found: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                null
        );
    }

    // ================== UNAUTHORIZED ==================

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>>
    handleUnauthorized(BadCredentialsException ex) {

        logger.warn("Authentication failed");

        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "Invalid credentials",
                null
        );
    }

    // ================== ACCESS DENIED ==================

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>>
    handleAccessDenied(AccessDeniedException ex) {

        logger.warn("Access denied: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "Access denied",
                null
        );
    }

    // ================== GLOBAL ==================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>>
    handleGlobalErrors(Exception ex) {

        logger.error("Unexpected error", ex);

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong",
                null
        );
    }

    // ================== HELPERS ==================

    private <T> ResponseEntity<ApiResponse<T>>
    buildErrorResponse(
            HttpStatus status,
            String message,
            T data) {

        ApiResponse<T> response =
                ApiResponse.error(message, data);

        return ResponseEntity
                .status(status)
                .body(response);
    }
}