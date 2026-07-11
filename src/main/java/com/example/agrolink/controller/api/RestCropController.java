package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.*;
import com.example.agrolink.service.CropService;

import jakarta.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/crops")
public class RestCropController {

    private static final Logger logger = LoggerFactory.getLogger(RestCropController.class);

    private final CropService cropService;

    public RestCropController(CropService cropService) {
        this.cropService = cropService;
    }

    @GetMapping
    public ApiResponse<PagedResponse<CropDTO>> searchCrops(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        logger.info("REST search crops: keyword={}, category={}, location={}", keyword, category, location);
        Page<CropDTO> cropPage = cropService.searchCrops(
                keyword,
                category,
                location,
                minPrice,
                maxPrice,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );

        return ApiResponse.success(toPagedResponse(cropPage));
    }

    @GetMapping("/{id}")
    public ApiResponse<CropDTO> getCropById(@PathVariable Long id) {
        logger.info("REST get crop: {}", id);
        return ApiResponse.success(cropService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ApiResponse<CropDTO> createCrop(@Valid @RequestBody CropRequestDTO dto, Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        logger.info("REST create crop by user: {}", principal.getName());
        CropDTO created = cropService.createCrop(dto, principal.getName());
        return ApiResponse.success("Crop created successfully", created);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ApiResponse<Void> deleteCrop(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Not authenticated");
        }
        logger.info("REST delete crop: {} by user: {}", id, principal.getName());
        cropService.softDelete(id, principal.getName());
        return ApiResponse.success("Crop deleted successfully");
    }

    private <T> PagedResponse<T> toPagedResponse(Page<T> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
