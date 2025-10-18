package com.invenpulse.controller;

import com.invenpulse.model.Product;
import com.invenpulse.model.StockMovement;
import com.invenpulse.repository.ProductRepository;
import com.invenpulse.repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/stock-movements")
public class StockMovementController {

    @Autowired
    private StockMovementRepository stockMovementRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<StockMovement> getStockMovementById(@PathVariable Long id) {
        StockMovement stockMovement = stockMovementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock movement not found with id: " + id));
        return ResponseEntity.ok(stockMovement);
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public List<StockMovement> getStockMovementsByProduct(@PathVariable Long productId) {
        return stockMovementRepository.findByProductId(productId);
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public List<StockMovement> getStockMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return stockMovementRepository.findByCreatedAtBetween(startDate, endDate);
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public List<StockMovement> getStockMovementsByType(@PathVariable StockMovement.MovementType type) {
        return stockMovementRepository.findByType(type);
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<StockMovement> createStockMovement(@Valid @RequestBody StockMovement stockMovement) {
        // Validate product exists
        Product product = productRepository.findById(stockMovement.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Update product quantity based on movement type
        int quantityChange = stockMovement.getQuantity();
        
        switch (stockMovement.getType()) {
            case PURCHASE:
            case RETURN:
            case ADJUSTMENT:
                product.setQuantity(product.getQuantity() + quantityChange);
                break;
            case SALE:
            case TRANSFER:
                if (product.getQuantity() < quantityChange) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }
                product.setQuantity(product.getQuantity() - quantityChange);
                break;
        }
        
        // Save updated product
        productRepository.save(product);
        
        // Save stock movement
        StockMovement savedStockMovement = stockMovementRepository.save(stockMovement);
        return new ResponseEntity<>(savedStockMovement, HttpStatus.CREATED);
    }
}