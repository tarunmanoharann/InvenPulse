package com.backend.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.inventory.model.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
}