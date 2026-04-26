package com.example.agrolink.controller;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.User;
import com.example.agrolink.service.CropService;
import com.example.agrolink.service.UserService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/crops")
public class CropController {

    private static final Logger logger = LoggerFactory.getLogger(CropController.class);

    private final CropService cropService;
    private final UserService userService;

    @Value("${app.page.size:5}")
    private int pageSize;

    public CropController(CropService cropService,
                          UserService userService) {
        this.cropService = cropService;
        this.userService = userService;
    }

    // ================== LIST CROPS ==================

    @GetMapping
    public String listCrops(Model model,
                            @RequestParam(defaultValue = "") String keyword,
                            @RequestParam(defaultValue = "") String category,
                            @RequestParam(defaultValue = "") String location,
                            @RequestParam(defaultValue = "0") double minPrice,
                            @RequestParam(defaultValue = "100000") double maxPrice,
                            @RequestParam(defaultValue = "0") int page) {

        Page<Crop> cropPage = cropService.searchCrops(
                keyword,
                category,
                location,
                minPrice,
                maxPrice,
                PageRequest.of(page, pageSize)
        );

        model.addAttribute("crops", cropPage);
        model.addAttribute("keyword", keyword);
        model.addAttribute("category", category);
        model.addAttribute("location", location);
        model.addAttribute("minPrice", minPrice);
        model.addAttribute("maxPrice", maxPrice);
        model.addAttribute("currentPage", page);

        return "crops";
    }

    // ================== ADD FORM ==================

    @PreAuthorize("hasRole('FARMER')")
    @GetMapping("/add")
    public String addCropPage(Model model) {
        model.addAttribute("crop", new Crop());
        return "add-crop";
    }

    // ================== SAVE CROP ==================

    @PreAuthorize("hasRole('FARMER')")
    @PostMapping("/add")
    public String addCrop(@Valid @ModelAttribute("crop") Crop crop,
                          BindingResult result,
                          @RequestParam("image") MultipartFile file,
                          Principal principal,
                          Model model) {

        if (principal == null) {
            return "redirect:/login";
        }

        logger.info("Adding crop by user: {}", principal.getName());

        // validation
        if (result.hasErrors()) {
            return "add-crop";
        }

        // image required
        if (file.isEmpty()) {
            model.addAttribute("errorMessage", "Image is required");
            return "add-crop";
        }

        // file type validation
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            model.addAttribute("errorMessage", "Only image files are allowed");
            return "add-crop";
        }

        try {
            User farmer = userService.findByEmail(principal.getName());

            cropService.createCrop(crop, file, farmer);

            logger.info("Crop created successfully");

        } catch (IllegalArgumentException ex) {
            logger.warn("Crop creation failed: {}", ex.getMessage());
            model.addAttribute("errorMessage", ex.getMessage());
            return "add-crop";
        }

        return "redirect:/crops";
    }

    // ================== DELETE CROP ==================

    @PreAuthorize("hasRole('FARMER')")
    @PostMapping("/delete/{id}")
    public String deleteCrop(@PathVariable Long id, Principal principal) {

        if (principal == null) {
            return "redirect:/login";
        }

        logger.info("Deleting crop {} by user {}", id, principal.getName());

        cropService.deleteCrop(id, principal.getName());

        return "redirect:/crops";
    }
}