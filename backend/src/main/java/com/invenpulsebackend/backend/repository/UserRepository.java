package com.invenpulsebackend.backend.repository;

import com.invenpulsebackend.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;




public interface UserRepository extends JpaRepository<User,Long> {

}
