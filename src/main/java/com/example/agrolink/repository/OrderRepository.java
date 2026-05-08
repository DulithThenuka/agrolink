package com.example.agrolink.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    // ================== BUYER ==================

    @EntityGraph(attributePaths = {"crop", "buyer"})
    Page<Order> findByBuyerOrderByCreatedAtDesc(
            User buyer,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"crop", "buyer"})
    Page<Order> findByBuyerAndStatusOrderByCreatedAtDesc(
            User buyer,
            OrderStatus status,
            Pageable pageable
    );

    // ================== FARMER ==================

    @EntityGraph(attributePaths = {"crop", "buyer"})
    @Query("""
        SELECT o
        FROM Order o
        WHERE o.crop.farmer = :farmer
        ORDER BY o.createdAt DESC
    """)
    Page<Order> findFarmerOrders(
            @Param("farmer") User farmer,
            Pageable pageable
    );

    // ================== ADMIN ==================

    @EntityGraph(attributePaths = {"crop", "buyer"})
    Page<Order> findAllByOrderByCreatedAtDesc(
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"crop", "buyer"})
    @Query("""
        SELECT o
        FROM Order o
        ORDER BY o.createdAt DESC
    """)
    Page<Order> findRecentOrders(
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"crop", "buyer"})
    List<Order> findTop5ByOrderByCreatedAtDesc();
}