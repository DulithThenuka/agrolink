package com.example.agrolink.exception;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.agrolink.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ================== VALIDATION ==================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Map<String, List<String>>>
    handleValidationExceptions(MethodArgumentNotValidException ex) {

        Map<String, List<String>> errors =
                new LinkedHashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->

                        errors.computeIfAbsent(
                                error.getField(),
                                k -> new ArrayList<>()
                        ).add(error.getDefaultMessage())
                );

        logger.warn("Validation failed: {}", errors);

        return ApiResponse.error(
                "Validation failed",
                errors
        );
    }

    // ================== BUSINESS ==================

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void>
    handleBusinessException(IllegalArgumentException ex) {

        logger.warn("Business error: {}", ex.getMessage());

        return ApiResponse.error(ex.getMessage());
    }

    // ================== NOT FOUND ==================

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void>
    handleNotFound(ResourceNotFoundException ex) {

        logger.warn("Resource not found: {}", ex.getMessage());

        return ApiResponse.error(ex.getMessage());
    }

    // ================== UNAUTHORIZED ==================

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<Void>
    handleUnauthorized(BadCredentialsException ex) {

        logger.warn("Authentication failed");

        return ApiResponse.error("Invalid credentials");
    }

    // ================== ACCESS DENIED ==================

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiResponse<Void>
    handleAccessDenied(AccessDeniedException ex) {

        logger.warn("Access denied: {}", ex.getMessage());

        return ApiResponse.error("Access denied");
    }

    // ================== INVALID JSON ==================

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void>
    handleInvalidJson(HttpMessageNotReadableException ex) {

        logger.warn("Invalid JSON request");

        return ApiResponse.error("Invalid request body");
    }

    // ================== GLOBAL ==================

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void>
    handleGlobalException(Exception ex) {

        logger.error("Unexpected error", ex);

        return ApiResponse.error("Something went wrong");
    }
}