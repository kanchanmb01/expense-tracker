package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Category;
import com.example.demo.entities.CategoryType;
import com.example.demo.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
//@CrossOrigin("*")
public class CategoryController {

	@Autowired
	CategoryService categoryService;
	
	
	@GetMapping("/all")
	public List<Category> getAllCategories() {
		return categoryService.getAllCategories();
	}
	
	@GetMapping("/getCategoryByType/{type}")
	public List<Category> getCategoriesByType(@PathVariable CategoryType type) {
		return categoryService.getCategoriesByType(type);
	}
}
