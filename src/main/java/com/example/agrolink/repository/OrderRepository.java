package com.example.agrolink.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByBuyerOrderByCreatedAtDesc(User buyer, Pageable pageable);

    Page<Order> findByBuyerAndStatus(User buyer, OrderStatus status, Pageable pageable);

    @Query("""
    SELECT o FROM Order o
    JOIN FETCH o.crop c
    JOIN FETCH o.buyer
    WHERE c.farmer = :farmer
    ORDER BY o.createdAt DESC
    """)
    Page<Order> findFarmerOrders(@Param("farmer") User farmer, Pageable pageable);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByOrderByCreatedAtDesc(Pageable pageable);
}