package com.yourcompany.inventorypulse.service;

import com.yourcompany.inventorypulse.exception.CustomException;
import com.yourcompany.inventorypulse.model.User;
import com.yourcompany.inventorypulse.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new CustomException("User not found"));
    }

    public User updateUser(User user) {
        User currentUser = getCurrentUser();
        currentUser.setName(user.getName());
        currentUser.setPhone(user.getPhone());
        currentUser.setAddress(user.getAddress());
        return userRepository.save(currentUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}