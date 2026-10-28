package com.example.demo.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.User;
import com.example.demo.service.AuthService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
//@CrossOrigin("*")
public class AuthController {
	
	@Autowired
	AuthService authService;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	  
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {
    	 	   log.info("Signup new user with email {}", user.getEmail());
    	       return authService.signup(user);
    
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");//raw password from user login
        
        log.info("Login attempt for email {}", email);

        // Authenticates user by loading user details from DB and validating password.
        // Internally: AuthenticationManager -> AuthenticationProvider -> UserDetailsService -> PasswordEncoder.
        // Returns authenticated Authentication object if valid, else throws exception.
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );
        
        log.info("User authenticated successfully {}",email);

        // If successful, generate token via AuthService
        return authService.login(authentication);

    }
  
   
}
