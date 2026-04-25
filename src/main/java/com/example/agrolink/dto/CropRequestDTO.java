package com.example.agrolink.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class CropRequestDTO {

    @NotBlank
    private String name;

    @NotNull
    private BigDecimal price;

    @Min(1)
    private Integer quantity;

    private String category;
    private String location;

    // getters & setters
}