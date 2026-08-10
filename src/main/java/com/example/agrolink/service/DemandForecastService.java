package com.example.agrolink.service;

import com.example.agrolink.dto.DemandForecastDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DemandForecastService {

    public DemandForecastDTO getDemandForecast(String province) {
        String name = (province != null && !province.isBlank()) ? province.trim() : "Western Province";
        String provLower = name.toLowerCase();

        List<DemandForecastDTO.CropDemandItem> items = new ArrayList<>();
        String notice;

        if (provLower.contains("central") && !provLower.contains("north")) {
            // Central Province (Production hub with highland veggie surplus)
            items.add(new DemandForecastDTO.CropDemandItem("Tomato", "VERY HIGH", 34.0, true, "High Inter-Province Export Demand to Western Hubs 🚀"));
            items.add(new DemandForecastDTO.CropDemandItem("Green Chili", "HIGH", 28.0, true, "Strong Buyer Procurement Orders 📈"));
            items.add(new DemandForecastDTO.CropDemandItem("Potato", "MEDIUM", 8.0, true, "Steady Local Cold Storage Clearance ⚖️"));
            items.add(new DemandForecastDTO.CropDemandItem("Cabbage", "LOW", -18.0, false, "Local Oversupply Risk — Divert to Processing ⚠️"));

            notice = "Production Hub Advisory (Central Province): Local cabbage harvest is exceeding regional demand. Farmers are advised to increase tomato & chili cultivation for export to Manning Market.";
        } else if (provLower.contains("northern")) {
            // Northern Province (Red Onion & Chili stronghold)
            items.add(new DemandForecastDTO.CropDemandItem("Red Onion", "VERY HIGH", 42.0, true, "National Procurement Target 🚀"));
            items.add(new DemandForecastDTO.CropDemandItem("Cassava", "HIGH", 21.0, true, "Local Food Security Index Upward 📈"));
            items.add(new DemandForecastDTO.CropDemandItem("Paddy / Rice", "MEDIUM", 12.0, true, "Stable Northern Grain Inflow ⚖️"));
            items.add(new DemandForecastDTO.CropDemandItem("Banana", "LOW", -8.0, false, "Adequate Local Supply ⚠️"));

            notice = "Northern Regional Market Allocation: High national demand for Jaffna Red Onions presents premium price margins. Farmers are encouraged to utilize dry-zone drip irrigation.";
        } else if (provLower.contains("southern")) {
            // Southern Province (Tourism & Coastal demand hub)
            items.add(new DemandForecastDTO.CropDemandItem("Papaya", "VERY HIGH", 38.0, true, "Hotel & Tourism Sector Demand Surge 🚀"));
            items.add(new DemandForecastDTO.CropDemandItem("Watermelon", "HIGH", 29.0, true, "Coastal Climate Refreshment Inflow 📈"));
            items.add(new DemandForecastDTO.CropDemandItem("Cucumber", "MEDIUM", 14.0, true, "Hospitality & Foodservice Clearance ⚖️"));
            items.add(new DemandForecastDTO.CropDemandItem("Pumpkin", "LOW", -11.0, false, "Market Saturation Warning ⚠️"));

            notice = "Southern Hospitality Procurement: Coastal tourism corridors are experiencing high demand for fresh fruit and salad crops. Shift land allocation toward Papaya and Watermelon.";
        } else {
            // Default / Western Province (Urban consumption hub)
            items.add(new DemandForecastDTO.CropDemandItem("Green Chili", "VERY HIGH", 31.0, true, "High Priority Urban Inflow 🚀"));
            items.add(new DemandForecastDTO.CropDemandItem("Tomato", "HIGH", 24.0, true, "Favorable Wholesale Market 📈"));
            items.add(new DemandForecastDTO.CropDemandItem("Carrot", "MEDIUM", 7.0, true, "Balanced City Consumption ⚖️"));
            items.add(new DemandForecastDTO.CropDemandItem("Green Beans", "LOW", -13.0, false, "Overproduction Warning in Supply Chain ⚠️"));

            notice = "Metropolitan Inflow Advisory (" + name + "): Preventing harvest crashes by balancing regional supply allocation across Colombo and Gampaha wholesale hubs.";
        }

        return new DemandForecastDTO(
            name,
            "Regional Supply-Demand Allocation Matrix",
            notice,
            items
        );
    }
}
