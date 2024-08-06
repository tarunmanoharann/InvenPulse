package com.backend.inventory.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
}