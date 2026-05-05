package com.example.agrolink.controller;

import java.security.Principal;

import com.example.agrolink.dto.CropRequestDTO;
import com.example.agrolink.service.CropService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/crops")
public class CropController {

    private static final Logger logger = LoggerFactory.getLogger(CropController.class);

    private final CropService cropService;

    @Value("${app.page.size:5}")
    private int pageSize;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    // ================== LIST CROPS ==================

    @GetMapping
    public String listCrops(Model model,
                           @RequestParam(required = false) String keyword,
                           @RequestParam(required = false) String category,
                           @RequestParam(required = false) String location,
                           @RequestParam(required = false) Double minPrice,
                           @RequestParam(required = false) Double maxPrice,
                           @RequestParam(defaultValue = "0") int page) {

        Page<?> cropPage = cropService.searchCrops(
                keyword,
                category,
                location,
                minPrice,
                maxPrice,
                PageRequest.of(page, pageSize, Sort.by("createdAt").descending())
        );

        model.addAttribute("crops", cropPage);
        model.addAttribute("currentPage", page);

        // Preserve filters
        model.addAttribute("keyword", keyword);
        model.addAttribute("category", category);
        model.addAttribute("location", location);
        model.addAttribute("minPrice", minPrice);
        model.addAttribute("maxPrice", maxPrice);

        return "crops";
    }

    // ================== ADD FORM ==================

    @PreAuthorize("hasRole('FARMER')")
    @GetMapping("/add")
    public String addCropPage(Model model) {
        model.addAttribute("crop", new CropRequestDTO());
        return "add-crop";
    }

    // ================== SAVE CROP ==================

    @PreAuthorize("hasRole('FARMER')")
    @PostMapping("/add")
    public String addCrop(@Valid @ModelAttribute("crop") CropRequestDTO dto,
                          BindingResult result,
                          @RequestParam("image") MultipartFile file,
                          Principal principal,
                          Model model) {

        if (principal == null) {
            return "redirect:/auth/login";
        }

        if (result.hasErrors()) {
            return "add-crop";
        }

        logger.info("Adding crop by user: {}", principal.getName());

        if (!isValidImage(file)) {
            model.addAttribute("errorMessage", "Valid image file is required");
            return "add-crop";
        }

        try {
            // ✅ FIX: pass file to service
            cropService.createCrop(dto, file, principal.getName());

            logger.info("Crop created successfully");

        } catch (IllegalArgumentException ex) {
            logger.warn("Crop creation failed: {}", ex.getMessage());
            model.addAttribute("errorMessage", ex.getMessage());
            return "add-crop";
        }

        return "redirect:/crops";
    }

    // ================== DELETE ==================

    @PreAuthorize("hasRole('FARMER')")
    @PostMapping("/delete/{id}")
    public String deleteCrop(@PathVariable Long id, Principal principal) {

        if (principal == null) {
            return "redirect:/auth/login";
        }

        logger.info("Deleting crop {} by user {}", id, principal.getName());

        try {
            cropService.softDelete(id, principal.getName());
        } catch (Exception ex) {
            logger.warn("Delete failed: {}", ex.getMessage());
        }

        return "redirect:/crops";
    }

    // ================== HELPERS ==================

    private boolean isValidImage(MultipartFile file) {
        return file != null &&
               !file.isEmpty() &&
               file.getContentType() != null &&
               file.getContentType().startsWith("image/");
    }
}