package com.backend.inventory.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.inventory.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    User findByEmail(String email);
    
    
}

