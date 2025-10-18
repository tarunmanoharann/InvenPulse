package com.invenpulse.repository;

import com.invenpulse.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductId(Long productId);
    List<StockMovement> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<StockMovement> findByType(StockMovement.MovementType type);
}