package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Category;
import com.example.demo.entities.CategoryType;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByType(CategoryType type);   // Fetch categories by INCOME/EXPENSE
}
