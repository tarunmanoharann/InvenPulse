package com.backend.inventory.controller;


import static org.springframework.http.HttpStatus.OK;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.inventory.auth.LoginRequest;
import com.backend.inventory.auth.RegisterRequest;
import com.backend.inventory.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Allows users to register by providing necessary registration details.")
    public ResponseEntity<?> register(@Parameter(description = "Registration details of the user") @RequestBody RegisterRequest registerRequest) {
        return new ResponseEntity<>(authService.register(registerRequest), OK);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Allows users to authenticate by providing valid login credentials.")
    public ResponseEntity<?> login(@Parameter(description = "Login credentials of the user") @RequestBody LoginRequest loginRequest) {
        return new ResponseEntity<>(authService.login(loginRequest), OK);
    }
}
