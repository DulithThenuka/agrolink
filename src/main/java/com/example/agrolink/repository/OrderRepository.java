package com.example.agrolink.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByBuyer(User buyer);

}