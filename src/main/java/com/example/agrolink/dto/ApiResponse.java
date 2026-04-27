package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final String errorCode;
    private final LocalDateTime timestamp;

    private ApiResponse(boolean success,
                        String message,
                        T data,
                        String errorCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
        this.timestamp = LocalDateTime.now();
    }

    // ================== SUCCESS ==================

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, null);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    // ================== ERROR ==================

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(false, message, null, errorCode);
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data, null);
    }

    // ================== GETTERS ==================

    public boolean isSuccess() { return success; }

    public String getMessage() { return message; }

    public T getData() { return data; }

    public String getErrorCode() { return errorCode; }

    public LocalDateTime getTimestamp() { return timestamp; }
}