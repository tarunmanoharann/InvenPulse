package com.backend.inventory.repository;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.inventory.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}