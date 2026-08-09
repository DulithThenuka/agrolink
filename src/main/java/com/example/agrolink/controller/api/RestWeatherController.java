package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.WeatherIntelligenceDTO;
import com.example.agrolink.service.WeatherIntelligenceService;

@RestController
@RequestMapping("/api/v1/weather")
public class RestWeatherController {

    private static final Logger logger = LoggerFactory.getLogger(RestWeatherController.class);

    private final WeatherIntelligenceService weatherService;

    public RestWeatherController(WeatherIntelligenceService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/intelligence")
    public ApiResponse<WeatherIntelligenceDTO> getWeatherIntelligence(@RequestParam(required = false) String location) {
        logger.info("REST Request for Weather Intelligence, location: {}", location);
        WeatherIntelligenceDTO intelligence = weatherService.getWeatherIntelligence(location);
        return ApiResponse.success(intelligence);
    }
}
