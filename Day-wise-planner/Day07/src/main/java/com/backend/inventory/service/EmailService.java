package com.backend.inventory.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreplycampusgrader@gmail.com");
        message.setTo(to);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is " + otp + ". It is valid for 10 minutes.");

        mailSender.send(message);
    }
}
