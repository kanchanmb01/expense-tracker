package com.example.demo.service;

import java.util.List;

import com.example.demo.entities.Category;
import com.example.demo.entities.CategoryType;

public interface CategoryService {
	
	List<Category> getAllCategories();
    List<Category> getCategoriesByType(CategoryType type);

}
