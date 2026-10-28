package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entities.Expense;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ExpenseRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ExpenseServiceImpl implements ExpenseService{
	
	@Autowired
	ExpenseRepository expenseRepo;
	
	@Override
	public Expense saveExpense(Expense expense) {
		log.info("Adding expense for user {} amount {}",
			    expense.getUser().getEmail(), expense.getAmount());
		
		return expenseRepo.save(expense);
	}

	@Override
	public List<Expense> getExpensesByUser(Integer userId) {
		List<Expense> expenses = expenseRepo.findByUser_UserId(userId);
		
		log.debug("Expenses list for user={} Expense={}",userId,expenses);
		
		return expenses;
	}

	@Override
	public void deleteExpense(Integer expenseId) {
		log.info("Deleting expense {}", expenseId);
		
		Expense expense = expenseRepo.findById(expenseId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Expense not found with id: " + expenseId));

	    expenseRepo.delete(expense);
		
	}
}
