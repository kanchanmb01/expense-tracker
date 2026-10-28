package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Category;
import com.example.demo.entities.CategoryType;
import com.example.demo.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService{
	
	@Autowired
	CategoryRepository categoryRepo;
	
	public List<Category> getAllCategories() {
		return categoryRepo.findAll();
	}
	
	public List<Category> getCategoriesByType(CategoryType type) {
		return categoryRepo.findByType(type);
	}

}
