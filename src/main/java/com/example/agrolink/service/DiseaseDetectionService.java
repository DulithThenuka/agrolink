package com.example.agrolink.service;

import com.example.agrolink.dto.DiseaseDetectionRequestDTO;
import com.example.agrolink.dto.DiseaseDetectionResponseDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DiseaseDetectionService {

    public DiseaseDetectionResponseDTO analyze(DiseaseDetectionRequestDTO request) {
        String crop = (request.getSampleCrop() != null && !request.getSampleCrop().isBlank()) ? request.getSampleCrop().trim() : "Tomato";
        String cropLower = crop.toLowerCase();

        String disease;
        String scientific;
        double confidence;
        String severity;
        List<String> actions = new ArrayList<>();
        String expertName = "Dr. K. L. Perera";
        String expertTitle = "Senior Agricultural Extension Specialist";
        String expertPhone = "+94 77 123 4567";
        String expertOffice = "Regional Agricultural Extension Office, Anuradhapura";

        if (cropLower.contains("rice") || cropLower.contains("paddy")) {
            disease = "Rice Leaf Blast (Magnaporthe Blast)";
            scientific = "Magnaporthe oryzae";
            confidence = 93.8;
            severity = "High";
            actions.add("Maintain standing water level of 5-7 cm in paddy field to inhibit spore germination");
            actions.add("Avoid excessive Nitrogen fertilizer applications during high humidity periods");
            actions.add("Apply recommended systemic fungicide (Tricyclazole 75% WP or Edifenphos)");
            actions.add("Inspect surrounding paddy bunds and destroy weed hosts");
            expertName = "Dr. S. Wickramasinghe";
            expertTitle = "Rice Pathologist & Chief Extension Officer";
            expertOffice = "Rice Research and Development Institute (RRDI), Batalagoda";
        } else if (cropLower.contains("potato")) {
            disease = "Potato Late Blight";
            scientific = "Phytophthora infestans";
            confidence = 95.4;
            severity = "High (Critical)";
            actions.add("Destroy infected plant vines 10-14 days prior to harvest to prevent tuber contamination");
            actions.add("Apply protective Mancozeb or Chlorothalonil spray before rain events");
            actions.add("Improve field ridge height to prevent fungal spores washing into tuber zone");
            actions.add("Ensure certified disease-free seed potatoes are used for next planting cycle");
            expertName = "Mrs. N. Rajapaksha";
            expertTitle = "Upcountry Crop Protection Specialist";
            expertOffice = "Regional Agricultural Research Station, Sita Eliya, Nuwara Eliya";
        } else if (cropLower.contains("chili") || cropLower.contains("pepper")) {
            disease = "Chili Leaf Curl Virus (CLCV)";
            scientific = "Begomovirus (Whitefly Vectored)";
            confidence = 91.2;
            severity = "Moderate-High";
            actions.add("Deploy yellow sticky traps (20 traps/acre) to monitor and catch vector whiteflies (Bemisia tabaci)");
            actions.add("Uproot and burn severely stunted plants exhibiting upward leaf curling");
            actions.add("Spray neem-based biopesticide or systemic insecticide (Imidacloprid) on foliage underside");
            actions.add("Maintain barrier crops (Maize or Sorghum) around chili plots");
            expertName = "Mr. M. T. Bandara";
            expertTitle = "Horticultural Pathologist";
            expertOffice = "Field Crops Research and Development Institute (FCRDI), Mahailluppallama";
        } else if (cropLower.contains("onion")) {
            disease = "Onion Purple Blotch";
            scientific = "Alternaria porri";
            confidence = 89.6;
            severity = "Moderate";
            actions.add("Avoid overhead sprinkler irrigation; switch to drip irrigation to keep foliage dry");
            actions.add("Practice a 3-year crop rotation with non-host crops such as maize or legume");
            actions.add("Apply Dithane M-45 or Copper Oxychloride spray at initial symptom appearance");
            actions.add("Ensure proper field drainage during rainy spells");
            expertName = "Dr. R. Farook";
            expertTitle = "Northern Dry Zone Extension Specialist";
            expertOffice = "District Agriculture Office, Jaffna";
        } else if (cropLower.contains("corn") || cropLower.contains("maize")) {
            disease = "Fall Armyworm Foliar Damage";
            scientific = "Spodoptera frugiperda";
            confidence = 94.1;
            severity = "High";
            actions.add("Apply sand/ash mixture into crop whirls to physically restrict worm movement");
            actions.add("Release parasitic wasps (Trichogramma) as biological control");
            actions.add("Apply recommended bio-insecticide (Spinotoram or Emamectin benzoate)");
            actions.add("Inspect whorls twice weekly during early crop growth");
            expertName = "Mr. K. Jayawardena";
            expertTitle = "Entomologist & Plant Health Officer";
            expertOffice = "Grain Legume and Oil Crops Research Station, Angunakolapelessa";
        } else {
            // Default / Tomato
            disease = "Tomato Early Blight";
            scientific = "Alternaria solani";
            confidence = 94.3;
            severity = "Moderate";
            actions.add("Remove severely infected lower leaves from plant canopy immediately");
            actions.add("Avoid overhead sprinkler watering; transition to ground drip irrigation");
            actions.add("Apply organic copper fungicide or consult an agricultural extension officer");
            actions.add("Mulch soil surface with straw to prevent fungal spore splash-back");
        }

        DiseaseDetectionResponseDTO.ExpertContact expert = new DiseaseDetectionResponseDTO.ExpertContact(
            expertName,
            expertTitle,
            expertPhone,
            expertOffice
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
