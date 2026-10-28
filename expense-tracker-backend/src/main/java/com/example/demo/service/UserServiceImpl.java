package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entities.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
	
	@Autowired
	UserRepository userRepo;
	
	@Override
	public User updateUser(Integer userId, User updatedUser) {
		 log.info("Updating user with id {}",userId);
		
		 User user = Optional.ofNullable(userRepo.findByUserId(userId))
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "User not found with id: " + userId));

	     user.setName(updatedUser.getName());
	     user.setPhone(updatedUser.getPhone());
	     user.setGender(updatedUser.getGender());

	     return userRepo.save(user);
	}

	@Override
	public List<User> getAllUsers() {
		return userRepo.findAll();
	}
	
	@Override
	public Optional<User> getUserByEmail(String email) {
		return userRepo.findByEmail(email);
	}
	
}
