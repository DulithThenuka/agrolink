package com.example.agrolink.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.agrolink.entity.SupplierOrder;

public interface SupplierOrderRepository extends JpaRepository<SupplierOrder, Long> {

    List<SupplierOrder> findByFarmerEmailOrderByCreatedAtDesc(String farmerEmail);

    List<SupplierOrder> findBySupplierItemSupplierEmailOrderByCreatedAtDesc(String supplierEmail);

    List<SupplierOrder> findAllByOrderByCreatedAtDesc();
}
