package com.example.agrolink.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ================== BUYER ==================

    // Paginated buyer orders
    Page<Order> findByBuyerOrderByCreatedAtDesc(User buyer, Pageable pageable);

    // Filter by status
    Page<Order> findByBuyerAndStatusOrderByCreatedAtDesc(
            User buyer,
            OrderStatus status,
            Pageable pageable
    );

    // ================== FARMER ==================

    // SAFE pagination (no fetch join)
    @Query("""
        SELECT o FROM Order o
        WHERE o.crop.farmer = :farmer
        ORDER BY o.createdAt DESC
    """)
    Page<Order> findFarmerOrders(@Param("farmer") User farmer, Pageable pageable);

    // OPTIONAL: fetch join version (NO pagination)
    @Query("""
        SELECT o FROM Order o
        JOIN FETCH o.crop
        JOIN FETCH o.buyer
        WHERE o.crop.farmer = :farmer
        ORDER BY o.createdAt DESC
    """)
    List<Order> findFarmerOrdersWithDetails(@Param("farmer") User farmer);

    // ================== ADMIN ==================

    // All orders paginated
    Page<Order> findByOrderByCreatedAtDesc(Pageable pageable);

    // Top 5 recent (dashboard)
    List<Order> findTop5ByOrderByCreatedAtDesc();
}