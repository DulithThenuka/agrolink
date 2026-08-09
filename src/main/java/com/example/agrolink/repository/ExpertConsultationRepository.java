package com.example.agrolink.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.agrolink.entity.ExpertConsultation;

public interface ExpertConsultationRepository extends JpaRepository<ExpertConsultation, Long> {

    List<ExpertConsultation> findByFarmerEmailOrderByCreatedAtDesc(String farmerEmail);

    List<ExpertConsultation> findByExpertSpecialtyOrderByCreatedAtDesc(String expertSpecialty);

    List<ExpertConsultation> findAllByOrderByCreatedAtDesc();
}
