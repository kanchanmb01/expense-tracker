package com.example.demo.service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.example.demo.entities.User;

public interface AuthService {
	
		ResponseEntity<?> signup(User user);
		ResponseEntity<?> login(Authentication authentication);
		
		//void deleteUser(Long userId);
}
