package com.example.agrolink.controller;

import com.example.agrolink.dto.PricePredictionResponseDTO;
import com.example.agrolink.service.PricePredictionService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PricePredictionController {

    private final PricePredictionService pricePredictionService;

    public PricePredictionController(PricePredictionService pricePredictionService) {
        this.pricePredictionService = pricePredictionService;
    }

    @GetMapping("/price-prediction")
    public String pricePrediction(@RequestParam(value = "crop", required = false, defaultValue = "Tomato") String crop, Model model) {
        PricePredictionResponseDTO prediction = pricePredictionService.getPrediction(crop);
        model.addAttribute("prediction", prediction);
        model.addAttribute("selectedCrop", crop);
        return "pages/prediction/price-prediction";
    }
}
