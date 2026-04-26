package com.example.agrolink.exception;

import com.example.agrolink.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ================== VALIDATION ==================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Map<String, List<String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, List<String>> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.computeIfAbsent(error.getField(), k -> new ArrayList<>())
                  .add(error.getDefaultMessage());
        });

        logger.warn("Validation failed: {}", errors);

        return new ApiResponse<>(false, "Validation failed", errors);
    }

    // ================== BUSINESS ==================

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleBusinessException(IllegalArgumentException ex) {

        logger.warn("Business error: {}", ex.getMessage());

        return new ApiResponse<>(false, ex.getMessage(), null);
    }

    // ================== NOT FOUND ==================

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void> handleNotFound(ResourceNotFoundException ex) {

        logger.warn("Not found: {}", ex.getMessage());

        return new ApiResponse<>(false, ex.getMessage(), null);
    }

    // ================== GLOBAL ==================

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleGlobalException(Exception ex) {

        logger.error("Unexpected error", ex);

        return new ApiResponse<>(false, "Something went wrong", null);
    }
}