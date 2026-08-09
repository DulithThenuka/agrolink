package com.example.agrolink.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.agrolink.dto.ExpertConsultationDTO;
import com.example.agrolink.dto.ExpertProfileDTO;
import com.example.agrolink.entity.ExpertConsultation;
import com.example.agrolink.repository.ExpertConsultationRepository;

@Service
@Transactional
public class ExpertConsultationService {

    private static final Logger logger = LoggerFactory.getLogger(ExpertConsultationService.class);

    private final ExpertConsultationRepository repository;

    public ExpertConsultationService(ExpertConsultationRepository repository) {
        this.repository = repository;
    }

    public List<ExpertProfileDTO> getAvailableExperts() {
        return List.of(
                new ExpertProfileDTO(101L, "Dr. Gamini Wickramasinghe", "Senior Agronomist", "Agronomist", "Kandy", 4.9, 184, "Available Today", "👨🔬"),
                new ExpertProfileDTO(102L, "Anura Jayasooriya", "Chief Agricultural Officer", "Agricultural Officer", "Nuwara Eliya", 4.8, 210, "Available Today", "🧑‍🌾"),
                new ExpertProfileDTO(103L, "Dr. Priyanka Ratnayake", "Livestock Veterinarian", "Veterinarian", "Gampaha", 4.9, 156, "Available Today", "👩⚕️"),
                new ExpertProfileDTO(104L, "Sunil Fernando", "Senior Soil Specialist", "Soil Specialist", "Anuradhapura", 4.7, 132, "Available Tomorrow", "🔬")
        );
    }

    public ExpertConsultationDTO submitConsultation(String farmerEmail,
                                                    String farmerName,
                                                    String expertSpecialty,
                                                    String question,
                                                    String farmData,
                                                    String imageUrl) {
        logger.info("Farmer {} submitting consultation inquiry for specialty: {}", farmerEmail, expertSpecialty);

        ExpertConsultation consultation = new ExpertConsultation();
        consultation.setFarmerEmail(farmerEmail);
        consultation.setFarmerName(farmerName != null ? farmerName : farmerEmail);
        consultation.setExpertSpecialty(expertSpecialty != null ? expertSpecialty : "Agronomist");
        consultation.setQuestion(question);
        consultation.setFarmData(farmData);
        consultation.setImageUrl(imageUrl);
        consultation.setStatus("PENDING");

        ExpertConsultation saved = repository.save(consultation);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ExpertConsultationDTO> getFarmerConsultations(String farmerEmail) {
        return repository.findByFarmerEmailOrderByCreatedAtDesc(farmerEmail)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpertConsultationDTO> getAllConsultations() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ExpertConsultationDTO replyToConsultation(Long consultationId, String reply, String expertName) {
        logger.info("Expert {} replying to consultation ID: {}", expertName, consultationId);

        ExpertConsultation consultation = repository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found with ID: " + consultationId));

        consultation.setReply(reply);
        consultation.setExpertName(expertName != null ? expertName : "Dr. Gamini Wickramasinghe (Agronomist)");
        consultation.setStatus("ANSWERED");
        consultation.setAnsweredAt(LocalDateTime.now());

        ExpertConsultation updated = repository.save(consultation);
        return mapToDTO(updated);
    }

    private ExpertConsultationDTO mapToDTO(ExpertConsultation entity) {
        return new ExpertConsultationDTO(
                entity.getId(),
                entity.getFarmerEmail(),
                entity.getFarmerName(),
                entity.getExpertName(),
                entity.getExpertSpecialty(),
                entity.getQuestion(),
                entity.getFarmData(),
                entity.getImageUrl(),
                entity.getStatus(),
                entity.getReply(),
                entity.getCreatedAt(),
                entity.getAnsweredAt()
        );
    }
}
