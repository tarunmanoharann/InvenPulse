package com.backend.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.inventory.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{

}
