package com.example.agrolink.controller;

import java.security.Principal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.User;
import com.example.agrolink.service.CropService;
import com.example.agrolink.service.FileStorageService;
import com.example.agrolink.service.UserService;

@Controller
@RequestMapping("/crops")
public class CropController {

    private final CropService cropService;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public CropController(CropService cropService,UserService userService,FileStorageService fileStorageService) {
    this.cropService = cropService;
    this.userService = userService;
    this.fileStorageService = fileStorageService;
}

    @GetMapping
    public String listCrops(Model model,
                           @RequestParam(defaultValue = "0") int page) {

        Page<Crop> cropPage = cropService.getAllActiveCrops(PageRequest.of(page, 5));

        model.addAttribute("crops", cropPage);
        return "crops";
    }

    @GetMapping("/add")
    public String addCropPage(Model model) {
        model.addAttribute("crop", new Crop());
        return "add-crop";
    }

    @PostMapping("/add")
    public String addCrop(@ModelAttribute Crop crop, Principal principal) {

        User farmer = userService.findByEmail(principal.getName());
        crop.setFarmer(farmer);

        cropService.save(crop);

        return "redirect:/crops";
    }

    @GetMapping("/delete/{id}")
    public String deleteCrop(@PathVariable Long id) {
        cropService.softDelete(id);
        return "redirect:/crops";
    }
}