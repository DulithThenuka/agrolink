package com.example.agrolink.service;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.example.agrolink.dto.WeatherIntelligenceDTO;
import com.example.agrolink.dto.WeatherIntelligenceDTO.DailyForecast;

@Service
public class WeatherIntelligenceService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherIntelligenceService.class);

    public WeatherIntelligenceDTO getWeatherIntelligence(String location) {
        logger.info("Fetching Weather Intelligence & Agronomic Warnings for location: {}", location);

        String targetLocation = (location != null && !location.isBlank()) ? location : "Nuwara Eliya / Kandy";

        List<DailyForecast> forecasts = List.of(
                new DailyForecast("Today", "Partly Cloudy ⛅", 27.0, 19.0, 4.0, "LOW"),
                new DailyForecast("Tomorrow", "Heavy Rain & Downpour 🌧️", 23.0, 17.0, 82.0, "HIGH"),
                new DailyForecast("Wednesday", "Scattered Showers 🌦️", 25.0, 18.0, 18.0, "MEDIUM"),
                new DailyForecast("Thursday", "Sunny Spells 🌤️", 28.0, 20.0, 2.0, "LOW"),
                new DailyForecast("Friday", "Clear & Warm ☀️", 29.0, 21.0, 0.0, "LOW"),
                new DailyForecast("Saturday", "Moderate Rain 🌧️", 24.0, 18.0, 24.0, "MEDIUM"),
                new DailyForecast("Sunday", "Thunderstorm Risk ⛈️", 22.0, 17.0, 45.0, "HIGH")
        );

        return new WeatherIntelligenceDTO(
                targetLocation,
                "⚠ Heavy Rain Warning",
                "Tomorrow 3 PM – 8 PM",
                82.0,
                "HIGH",
                List.of("Tomatoes", "Chili", "Potato"),
                "Avoid fertilizer application tomorrow. Ensure field drainage channels are clear to prevent root rot.",
                26.0,
                "High 28°C / Low 19°C",
                84.0,
                18.0,
                "SW",
                "Normal Soil Moisture (0% Drought Risk)",
                "HIGH (Flash Flood Warning in Lowland Basins)",
                "Pause automated drip irrigation for the next 48 hours.",
                forecasts
        );
    }
}
