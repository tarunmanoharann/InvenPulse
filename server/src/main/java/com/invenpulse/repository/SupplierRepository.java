package com.invenpulse.repository;

import com.invenpulse.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByCompanyNameContainingIgnoreCase(String companyName);
    boolean existsByCompanyNameIgnoreCase(String companyName);
    boolean existsByEmail(String email);
}