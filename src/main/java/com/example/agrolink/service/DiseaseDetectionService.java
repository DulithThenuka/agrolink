package com.example.agrolink.service;

import com.example.agrolink.dto.DiseaseDetectionRequestDTO;
import com.example.agrolink.dto.DiseaseDetectionResponseDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DiseaseDetectionService {

    public DiseaseDetectionResponseDTO analyze(DiseaseDetectionRequestDTO request) {
        String crop = request.getSampleCrop() != null ? request.getSampleCrop() : "Tomato";

        String disease = "Tomato Early Blight";
        String scientific = "Alternaria solani";
        double confidence = 94.3;
        String severity = "Moderate";

        if ("Rice".equalsIgnoreCase(crop)) {
            disease = "Rice Leaf Blast";
            scientific = "Magnaporthe oryzae";
            confidence = 92.8;
            severity = "High";
        } else if ("Potato".equalsIgnoreCase(crop)) {
            disease = "Potato Late Blight";
            scientific = "Phytophthora infestans";
            confidence = 96.1;
            severity = "High";
        }

        List<String> actions = new ArrayList<>();
        actions.add("Remove severely infected leaves from plant canopy immediately");
        actions.add("Avoid overhead sprinkler watering; transition to drip irrigation");
        actions.add("Improve field row ventilation and sunlight exposure");
        actions.add("Apply organic copper fungicide or consult an agricultural extension officer");

        DiseaseDetectionResponseDTO.ExpertContact expert = new DiseaseDetectionResponseDTO.ExpertContact(
            "Dr. K. L. Perera",
            "Senior Agricultural Extension Specialist",
            "+94 77 123 4567",
            "Regional Agricultural Office, Anuradhapura"
        );

        return new DiseaseDetectionResponseDTO(
            disease,
            scientific,
            confidence,
            severity,
            actions,
            expert
        );
    }
}
