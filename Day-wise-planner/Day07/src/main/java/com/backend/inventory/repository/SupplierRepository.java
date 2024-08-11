package com.backend.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.inventory.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

}
