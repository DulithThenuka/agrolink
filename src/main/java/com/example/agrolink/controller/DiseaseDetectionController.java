package com.example.agrolink.controller;

import com.example.agrolink.dto.DiseaseDetectionRequestDTO;
import com.example.agrolink.dto.DiseaseDetectionResponseDTO;
import com.example.agrolink.service.DiseaseDetectionService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/disease-detection")
public class DiseaseDetectionController {

    private final DiseaseDetectionService diseaseDetectionService;

    public DiseaseDetectionController(DiseaseDetectionService diseaseDetectionService) {
        this.diseaseDetectionService = diseaseDetectionService;
    }

    @GetMapping
    public String diseaseForm(Model model) {
        DiseaseDetectionRequestDTO defaultRequest = new DiseaseDetectionRequestDTO("Tomato", null);
        DiseaseDetectionResponseDTO response = diseaseDetectionService.analyze(defaultRequest);

        model.addAttribute("request", defaultRequest);
        model.addAttribute("result", response);
        return "pages/disease/disease-detection";
    }

    @PostMapping("/scan")
    public String scanImage(@ModelAttribute("request") DiseaseDetectionRequestDTO request, Model model) {
        DiseaseDetectionResponseDTO response = diseaseDetectionService.analyze(request);
        model.addAttribute("request", request);
        model.addAttribute("result", response);
        return "pages/disease/disease-detection";
    }
}
