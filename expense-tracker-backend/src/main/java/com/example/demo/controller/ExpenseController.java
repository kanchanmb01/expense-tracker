package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.config.CustomUserDetails;
import com.example.demo.entities.Expense;
import com.example.demo.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
//@CrossOrigin("*")
public class ExpenseController {
	
	@Autowired
	ExpenseService expenseService;
	
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/addExpense")
    public ResponseEntity<?> addExpense(@Valid @RequestBody Expense expense) {

        Authentication authentication =
                SecurityContextHolder
                    .getContext()
                    .getAuthentication();

        CustomUserDetails user =
                (CustomUserDetails)
                 authentication.getPrincipal();

        if (!user.getUserId()
                 .equals(expense.getUser().getUserId())) {
            throw new AccessDeniedException("Access denied");
        }

        return ResponseEntity.ok(
                expenseService.saveExpense(expense));
    }
    
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/getExpenses/user/{userId}")
    public ResponseEntity<?> getExpensesByUser(@PathVariable Integer userId) {
    	 	 Authentication authentication =
                 SecurityContextHolder
                     .getContext()
                     .getAuthentication();

         CustomUserDetails user =
                 (CustomUserDetails)
                  authentication.getPrincipal();

         if (!user.getUserId()
                  .equals(userId)) {
             throw new AccessDeniedException("Access denied");
         }
		
		return ResponseEntity.ok(expenseService.getExpensesByUser(userId));
	}
 
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("deleteExpense/user/{userId}/expense/{expenseId}")
    public ResponseEntity<String> deleteExpense(@PathVariable Integer userId,@PathVariable Integer expenseId) {
    	 	 Authentication authentication = SecurityContextHolder
                     .getContext()
                     .getAuthentication();

         CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

         if (!user.getUserId()
                  .equals(userId)) {
             throw new AccessDeniedException("Access denied");
         }
          
          expenseService.deleteExpense(expenseId);
          return ResponseEntity.noContent().build();

    }

}
