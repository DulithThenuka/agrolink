package com.example.agrolink.repository;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.agrolink.entity.Crop;

public interface CropRepository
        extends JpaRepository<Crop, Long>,
        JpaSpecificationExecutor<Crop> {

    // ================== BASIC ==================

    Page<Crop> findByActiveTrue(
            Pageable pageable
    );

    java.util.List<Crop> findByFarmerIdAndActiveTrue(Long farmerId);

    // ================== SEARCH ==================

    @EntityGraph(attributePaths = {"farmer"})
    @Query("""
        SELECT c
        FROM Crop c
        WHERE c.active = true

        AND (
            :name = ''
            OR LOWER(c.name)
            LIKE LOWER(CONCAT('%', :name, '%'))
        )

        AND (
            :category = ''
            OR LOWER(c.category)
            LIKE LOWER(CONCAT('%', :category, '%'))
        )

        AND (
            :location = ''
            OR LOWER(c.location)
            LIKE LOWER(CONCAT('%', :location, '%'))
        )

        AND (
            :minPrice IS NULL
            OR c.price >= :minPrice
        )

        AND (
            :maxPrice IS NULL
            OR c.price <= :maxPrice
        )
    """)
    Page<Crop> searchCrops(
            @Param("name") String name,

            @Param("category") String category,

            @Param("location") String location,

            @Param("minPrice") BigDecimal minPrice,

            @Param("maxPrice") BigDecimal maxPrice,

            Pageable pageable
    );

    // ================== FETCH ==================

    @EntityGraph(attributePaths = {"farmer"})
    @Query("""
        SELECT c
        FROM Crop c
        WHERE c.active = true
    """)
    Page<Crop> findAllWithFarmer(
            Pageable pageable
    );
}