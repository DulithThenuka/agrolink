package com.example.agrolink.repository;

import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ================== BUYER ==================

    Page<Order> findByBuyerOrderByCreatedAtDesc(User buyer, Pageable pageable);

    Page<Order> findByBuyerAndStatusOrderByCreatedAtDesc(
            User buyer,
            OrderStatus status,
            Pageable pageable
    );

    // ================== FARMER ==================

    @Query("""
        SELECT o FROM Order o
        WHERE o.crop.farmer = :farmer
        ORDER BY o.createdAt DESC
    """)
    Page<Order> findFarmerOrders(@Param("farmer") User farmer, Pageable pageable);

    // ⚡ Better alternative using EntityGraph (safe with pagination)
    @EntityGraph(attributePaths = {"crop", "buyer"})
    @Query("""
        SELECT o FROM Order o
        WHERE o.crop.farmer = :farmer
    """)
    Page<Order> findFarmerOrdersWithDetails(@Param("farmer") User farmer, Pageable pageable);

    // ================== ADMIN ==================

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("""
        SELECT o FROM Order o
        ORDER BY o.createdAt DESC
    """)
    Page<Order> findRecentOrders(Pageable pageable);

    List<Order> findTop5ByOrderByCreatedAtDesc();

    public Object findByOrderByCreatedAtDesc(Pageable pageable);
}