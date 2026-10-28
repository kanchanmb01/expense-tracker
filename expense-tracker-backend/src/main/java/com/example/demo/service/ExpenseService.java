package com.example.demo.service;

import java.util.List;
import com.example.demo.entities.Expense;


public interface ExpenseService {
	
	Expense saveExpense(Expense expense);
	
    List<Expense> getExpensesByUser(Integer userId);
    
    void deleteExpense(Integer expenseId);
}
