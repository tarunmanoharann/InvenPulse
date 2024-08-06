package com.backend.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.inventory.exception.EmailAlreadyRegisteredException;
import com.backend.inventory.model.Product;
import com.backend.inventory.model.User;
import com.backend.inventory.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyRegisteredException(user.getEmail());
        }
        return userRepository.save(user);
    }

    public void deleteAllUsers() {
        
        userRepository.deleteAll();
    }

    public User getUser(long id) {
        return userRepository.findById(id).orElse(null);
        
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // public User updateUser(long id, User user) {
        
    //     User existingUser = userRepository.findById(id).orElse(null);
    //     existingUser.setFirstname(user.getFirstname());
    //     existingUser.setLastname(user.getLastname());
    //     existingUser.setEmail(user.getEmail());
    //     existingUser.setPassword(user.getPassword());

    //     return userRepository.save(existingUser);

        
    // }

    public String deleteById(long id) {

        if(!userRepository.existsById(id))
        {
            return "user with Id:"+id+" does not exists";
        }
        userRepository.deleteById(id);
        return "user with id "+id+" has been deleted success.";
    }

    

   
}

