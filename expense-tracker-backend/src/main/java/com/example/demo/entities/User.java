package com.example.demo.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
public class User {

		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer userId;

		@NotBlank(message = "Name is required")
		@Size(max = 100, message = "Name cannot exceed 100 characters")
		@Column(nullable = false, length = 100)
	    private String name;

		@NotBlank(message = "Email is required")
		@Email(message = "Invalid email format")
		@Size(max = 150, message = "Email cannot exceed 150 characters")
	    @Column(unique = true, nullable = false, length = 150)
	    private String email;

		@NotBlank(message = "Password is required")
		@Size(min = 6, max = 255,
		      message = "Password must be between 6 and 255 characters")
	    @Column(nullable = false, length = 255)
	    private String password;

	    @Column(length = 10)
	    private String role = "USER";
	    
	    @Column(length = 12)
	    private String phone; 
	    
	    @Column(length = 20)
	    private String gender;

	    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", 
	    		updatable = false, insertable = false)
	    private LocalDateTime createdAt = LocalDateTime.now();
}
