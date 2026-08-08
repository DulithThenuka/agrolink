package com.example.agrolink.service;

import com.example.agrolink.dto.DemandForecastDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DemandForecastService {

    public DemandForecastDTO getDemandForecast(String province) {
        String name = (province != null && !province.isBlank()) ? province : "Western Province";

        List<DemandForecastDTO.CropDemandItem> items = new ArrayList<>();
        items.add(new DemandForecastDTO.CropDemandItem("Chili", "VERY HIGH", 31.0, true, "High Priority Planting 🚀"));
        items.add(new DemandForecastDTO.CropDemandItem("Tomato", "HIGH", 24.0, true, "Favorable Market Market 📈"));
        items.add(new DemandForecastDTO.CropDemandItem("Carrot", "MEDIUM", 7.0, true, "Balanced Production ⚖️"));
        items.add(new DemandForecastDTO.CropDemandItem("Beans", "LOW", 13.0, false, "Overproduction Warning ⚠️"));

        String notice = "Preventing Harvest Crashes: By diversifying away from Beans and towards Chili & Tomatoes, AgroLink protects local farmer incomes while ensuring consumer price stability in " + name + ".";

        return new DemandForecastDTO(
            name,
            "Balanced Supply Allocation",
            notice,
            items
        );
    }
}
