package com.example.agrolink.dto;

public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    // ✅ Default constructor
    public ApiResponse() {}

    // ✅ Success with data
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // ✅ Success without data
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // getters & setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}