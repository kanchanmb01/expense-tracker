package com.example.demo.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.config.JwtUtil;
import com.example.demo.entities.User;
import com.example.demo.exception.UserAlreadyExistsException;
import com.example.demo.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

	@Autowired
	UserRepository userRepo;
	
	@Autowired
    private JwtUtil jwtUtil;
	
	@Autowired
    private PasswordEncoder passwordEncoder;
	
	@Override
	public ResponseEntity<?> signup(User user) {
		if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            log.info("User already present {}:",user.getEmail());
			throw new UserAlreadyExistsException("User already exists");
        }
		 //Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setRole("USER");
		userRepo.save(user);
        return ResponseEntity.ok("User registered successfully");
	}
	
	@Override
    public ResponseEntity<?> login(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepo.findByEmail(email);
        
        if (userOpt.isPresent()) {
        		User user = userOpt.get();
            String token = jwtUtil.generateToken(user);//include userId as claim in generateToken
            Map<String, Object> response = new HashMap<>();
            //after successful login, JWT sent to client.
            response.put("token", token);
            response.put("user", user);
            
            log.debug("Token generated for user = {}, token={}",user.getEmail(),token);
            
            return ResponseEntity.ok(response);
        } else {
        		log.info("User not found");
            return ResponseEntity.status(401).body("User not found");
        }
    }	

}
