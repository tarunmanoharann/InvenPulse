package com.backend.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.inventory.model.Product;

public interface ProductRepository extends JpaRepository<Product,Long> {
    

}
