package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import com.example.demo.entities.User;

public interface UserService {
	
	User updateUser(Integer userId, User updatedUser);
	List<User> getAllUsers();
	Optional<User> getUserByEmail(String email);

}
