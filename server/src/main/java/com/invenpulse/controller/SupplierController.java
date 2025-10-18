package com.invenpulse.controller;

import com.invenpulse.model.Supplier;
import com.invenpulse.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        return ResponseEntity.ok(supplier);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public List<Supplier> searchSuppliers(@RequestParam String companyName) {
        return supplierRepository.findByCompanyNameContainingIgnoreCase(companyName);
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Supplier> createSupplier(@Valid @RequestBody Supplier supplier) {
        if (supplierRepository.existsByCompanyNameIgnoreCase(supplier.getCompanyName())) {
            throw new RuntimeException("Supplier company name already exists");
        }
        
        if (supplier.getEmail() != null && supplierRepository.existsByEmail(supplier.getEmail())) {
            throw new RuntimeException("Supplier email already exists");
        }
        
        Supplier savedSupplier = supplierRepository.save(supplier);
        return new ResponseEntity<>(savedSupplier, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @Valid @RequestBody Supplier supplierDetails) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        
        // Check if company name is being changed and if it already exists
        if (!supplier.getCompanyName().equalsIgnoreCase(supplierDetails.getCompanyName()) && 
            supplierRepository.existsByCompanyNameIgnoreCase(supplierDetails.getCompanyName())) {
            throw new RuntimeException("Supplier company name already exists");
        }
        
        // Check if email is being changed and if it already exists
        if (supplierDetails.getEmail() != null && 
            !supplierDetails.getEmail().equals(supplier.getEmail()) && 
            supplierRepository.existsByEmail(supplierDetails.getEmail())) {
            throw new RuntimeException("Supplier email already exists");
        }
        
        supplier.setCompanyName(supplierDetails.getCompanyName());
        supplier.setContactPerson(supplierDetails.getContactPerson());
        supplier.setEmail(supplierDetails.getEmail());
        supplier.setPhone(supplierDetails.getPhone());
        supplier.setAddress(supplierDetails.getAddress());
        supplier.setCity(supplierDetails.getCity());
        supplier.setCountry(supplierDetails.getCountry());
        supplier.setTaxId(supplierDetails.getTaxId());
        supplier.setPaymentTerms(supplierDetails.getPaymentTerms());
        supplier.setStatus(supplierDetails.getStatus());
        
        Supplier updatedSupplier = supplierRepository.save(supplier);
        return ResponseEntity.ok(updatedSupplier);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteSupplier(@PathVariable Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        
        supplierRepository.delete(supplier);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}