package com.backend.inventory.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.inventory.exception.EmailAlreadyRegisteredException;
import com.backend.inventory.model.User;
import com.backend.inventory.service.EmailService;
import com.backend.inventory.service.UserService;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    // ... existing methods ...

    

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (EmailAlreadyRegisteredException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        try {
            List<User> users = userService.getUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable long id) {
        try {
            User user = userService.getUser(id);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

@GetMapping("/email")
public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
    try {
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


@GetMapping("/cron")
public ResponseEntity<String> getUserByCron() {
    return new ResponseEntity<>("Hi There", HttpStatus.OK);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {

        try {

            userService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    @PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
    String email = credentials.get("email");
    String password = credentials.get("password");

    try {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        if (user.getPassword().equals(password)) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
        }
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


@PutMapping("/{id}")
public ResponseEntity<User> updateUser(@PathVariable long id, @RequestBody User updatedUser) {
    try {
        User user = userService.updateUser(id, updatedUser);
        return new ResponseEntity<>(user, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}




    @DeleteMapping
    public ResponseEntity<Void> deleteAllUsers() {

        try {

            userService.deleteAllUsers();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }


    

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || otp == null) {
            return new ResponseEntity<>("Email and OTP are required", HttpStatus.BAD_REQUEST);
        }

        try {
            emailService.sendOtpEmail(email, otp);
            return new ResponseEntity<>("OTP sent successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to send OTP: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
