package com.backend.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.inventory.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long>{

}
