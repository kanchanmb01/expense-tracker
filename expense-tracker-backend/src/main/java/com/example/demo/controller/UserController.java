package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.config.CustomUserDetails;
import com.example.demo.entities.User;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/user")
//@CrossOrigin("*")
public class UserController {
	
	@Autowired
	UserService userService;
	
	//Update user details
	@PutMapping("/update/{userId}")
	public ResponseEntity<?> updateUser(@PathVariable Integer userId, @RequestBody User updatedUser){
		
		 Authentication authentication = SecurityContextHolder
                 .getContext()
                 .getAuthentication();

	     CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
	
	     if (!user.getUserId().equals(userId)) {
	         throw new AccessDeniedException("Access denied");
	     }
				
	    return ResponseEntity.ok(userService.updateUser(userId, updatedUser));
	}
	
		
	//Get All users
	@PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUser(){
    		return userService.getAllUsers();
    }

}
