package com.example.agrolink.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.agrolink.entity.SupplierItem;

public interface SupplierItemRepository extends JpaRepository<SupplierItem, Long> {

    List<SupplierItem> findByActiveTrueOrderByCreatedAtDesc();

    List<SupplierItem> findByCategoryIgnoreCaseAndActiveTrue(String category);

    List<SupplierItem> findBySupplierEmail(String supplierEmail);
}
