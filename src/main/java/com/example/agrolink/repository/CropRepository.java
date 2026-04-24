package com.example.agrolink.repository;
import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.agrolink.entity.Crop;

public interface CropRepository extends JpaRepository<Crop, Long> {

    Page<Crop> findByActiveTrue(Pageable pageable);

    @Query("""
        SELECT c FROM Crop c
        WHERE c.active = true
        AND LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))
        AND LOWER(c.category) LIKE LOWER(CONCAT('%', :category, '%'))
        AND LOWER(c.farmer.location) LIKE LOWER(CONCAT('%', :location, '%'))
        AND c.price BETWEEN :minPrice AND :maxPrice
    """)
    Page<Crop> searchCrops(
            @Param("name") String name,
            @Param("category") String category,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );
}