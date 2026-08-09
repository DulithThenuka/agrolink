package com.example.agrolink.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.agrolink.entity.EquipmentBooking;

public interface EquipmentBookingRepository extends JpaRepository<EquipmentBooking, Long> {

    List<EquipmentBooking> findByFarmerEmailOrderByCreatedAtDesc(String farmerEmail);

    List<EquipmentBooking> findByEquipmentOwnerEmailOrderByCreatedAtDesc(String ownerEmail);

    List<EquipmentBooking> findAllByOrderByCreatedAtDesc();
}
