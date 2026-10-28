package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    
	List<Expense> findByUser_UserId(Integer userId);

}