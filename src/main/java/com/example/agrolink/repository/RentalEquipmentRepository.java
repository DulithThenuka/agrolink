package com.example.agrolink.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.agrolink.entity.RentalEquipment;

public interface RentalEquipmentRepository extends JpaRepository<RentalEquipment, Long> {

    List<RentalEquipment> findByActiveTrueOrderByCreatedAtDesc();

    List<RentalEquipment> findByCategoryIgnoreCaseAndActiveTrue(String category);

    List<RentalEquipment> findByLocationIgnoreCaseAndActiveTrue(String location);

    List<RentalEquipment> findByCategoryIgnoreCaseAndLocationIgnoreCaseAndActiveTrue(String category, String location);
}
