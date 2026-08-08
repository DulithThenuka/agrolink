package com.example.agrolink.controller;

import com.example.agrolink.dto.CropAdvisorRequestDTO;
import com.example.agrolink.dto.CropAdvisorResponseDTO;
import com.example.agrolink.service.CropAdvisorService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.math.BigDecimal;

@Controller
@RequestMapping("/advisor")
public class CropAdvisorController {

    private final CropAdvisorService cropAdvisorService;

    public CropAdvisorController(CropAdvisorService cropAdvisorService) {
        this.cropAdvisorService = cropAdvisorService;
    }

    @GetMapping
    public String advisorForm(Model model) {
        CropAdvisorRequestDTO defaultRequest = new CropAdvisorRequestDTO(
            "Anuradhapura", 2.0, "Sandy Loam", "Medium", "September", new BigDecimal("150000")
        );
        CropAdvisorResponseDTO response = cropAdvisorService.analyze(defaultRequest);

        model.addAttribute("request", defaultRequest);
        model.addAttribute("result", response);
        return "pages/advisor/advisor";
    }

    @PostMapping("/analyze")
    public String analyzeCrop(@ModelAttribute("request") CropAdvisorRequestDTO request, Model model) {
        CropAdvisorResponseDTO response = cropAdvisorService.analyze(request);
        model.addAttribute("request", request);
        model.addAttribute("result", response);
        return "pages/advisor/advisor";
    }
}
