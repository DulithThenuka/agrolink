package com.example.agrolink.controller;

import com.example.agrolink.dto.AnalyticsDTO;
import com.example.agrolink.service.AnalyticsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics")
    public String analytics(Model model) {
        AnalyticsDTO analytics = analyticsService.getAnalyticsData();
        model.addAttribute("analytics", analytics);
        return "pages/analytics/analytics";
    }
}
