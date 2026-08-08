package com.example.agrolink.controller;

import com.example.agrolink.dto.DemandForecastDTO;
import com.example.agrolink.service.DemandForecastService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DemandForecastController {

    private final DemandForecastService demandForecastService;

    public DemandForecastController(DemandForecastService demandForecastService) {
        this.demandForecastService = demandForecastService;
    }

    @GetMapping("/demand-forecasting")
    public String demandForecasting(@RequestParam(value = "province", required = false, defaultValue = "Western Province") String province, Model model) {
        DemandForecastDTO forecast = demandForecastService.getDemandForecast(province);
        model.addAttribute("forecast", forecast);
        model.addAttribute("selectedProvince", province);
        return "pages/forecasting/demand-forecasting";
    }
}
