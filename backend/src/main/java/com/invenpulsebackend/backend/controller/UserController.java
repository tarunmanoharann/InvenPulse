package com.invenpulsebackend.backend.controller;


import com.invenpulsebackend.backend.exception.UserNotFoundException;
import com.invenpulsebackend.backend.model.User;
import com.invenpulsebackend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserRepository ur;

    @PostMapping("/user")
    User newUser(@RequestBody User newUser) {
        return ur.save(newUser);
    }

    @GetMapping("/users")
    List<User> getAllUsers() {
        return ur.findAll();
    }

    @GetMapping("/user/{id}")
    User getUserById(@PathVariable Long id) {
        return ur.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PutMapping("/user/{id}")
    User updateUser(@RequestBody User newUser, @PathVariable Long id) {
        return ur.findById(id)
                .map(user -> {
                    user.setUsername(newUser.getUsername());
                    user.setName(newUser.getName());
                    user.setEmail(newUser.getEmail());
                    return ur.save(user);
                }).orElseThrow(() -> new UserNotFoundException(id));
    }

    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable Long id){
        if(!ur.existsById(id)){
            throw new UserNotFoundException(id);
        }
        ur.deleteById(id);
        return  "User with id "+id+" has been deleted success.";
    }

}
