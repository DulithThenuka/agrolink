package com.example.agrolink.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agrolink.entity.Crop;

public interface CropRepository extends JpaRepository<Crop, Long> {

    Page<Crop> findByActiveTrueAndNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndFarmer_LocationContainingIgnoreCaseAndPriceBetween(
            String name,
            String category,
            String location,
            double minPrice,
            double maxPrice,
            Pageable pageable
    );
}