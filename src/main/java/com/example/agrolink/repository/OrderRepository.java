package com.example.agrolink.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Buyer orders
    Page<Order> findByBuyerOrderByCreatedAtDesc(User buyer, Pageable pageable);

    // Filter by status
    List<Order> findByBuyerAndStatus(User buyer, OrderStatus status);

    // Farmer view (orders for their crops)
    List<Order> findByCrop_Farmer(User farmer);

    // Admin view
    List<Order> findAllByOrderByCreatedAtDesc();
}