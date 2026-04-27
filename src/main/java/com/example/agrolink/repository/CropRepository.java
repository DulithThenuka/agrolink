package com.example.agrolink.repository;

import com.example.agrolink.entity.Crop;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface CropRepository extends JpaRepository<Crop, Long>, JpaSpecificationExecutor<Crop> {

    // ================== BASIC ==================

    Page<Crop> findByActiveTrue(Pageable pageable);

    // ================== SEARCH ==================

    @Query("""
        SELECT c FROM Crop c
        WHERE c.active = true
        AND (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:category IS NULL OR LOWER(c.category) LIKE LOWER(CONCAT('%', :category, '%')))
        AND (:location IS NULL OR LOWER(c.farmer.location) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:minPrice IS NULL OR c.price >= :minPrice)
        AND (:maxPrice IS NULL OR c.price <= :maxPrice)
    """)
    Page<Crop> searchCrops(
            @Param("name") String name,
            @Param("category") String category,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    // ================== OPTIONAL (FUTURE USE) ==================

    @EntityGraph(attributePaths = {"farmer"})
    @Query("SELECT c FROM Crop c WHERE c.active = true")
    Page<Crop> findAllWithFarmer(Pageable pageable);
}