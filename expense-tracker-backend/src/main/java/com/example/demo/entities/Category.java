package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@Data                 
@NoArgsConstructor      
@AllArgsConstructor     
public class Category {
	
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer categoryId;

	    @Column(nullable = false, length = 100)
	    private String categoryName;

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private CategoryType type; // INCOME or EXPENSE

}
