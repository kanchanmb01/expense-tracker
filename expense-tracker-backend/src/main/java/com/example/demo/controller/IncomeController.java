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
import com.example.demo.entities.Income;
import com.example.demo.service.IncomeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/income")
//@CrossOrigin("*")
public class IncomeController {

	@Autowired
	IncomeService incomeService;
	 
 	//Add new income 
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/addIncome")
    public ResponseEntity<?> addIncome(@Valid @RequestBody Income income) {
        
        Authentication authentication =SecurityContextHolder
                    .getContext()
                    .getAuthentication();

        CustomUserDetails user =
                (CustomUserDetails)
                 authentication.getPrincipal();

        if (!user.getUserId()
                 .equals(income.getUser().getUserId())) {

            throw new AccessDeniedException("Access denied");
        }

        return ResponseEntity.ok(incomeService.saveIncome(income));
    }
	
	// Get all income for a user
	@PreAuthorize("hasRole('USER')")
    @GetMapping("/getIncome/user/{userId}")
	public ResponseEntity<?> getIncomeByUser(@PathVariable Integer userId) {
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
		
		return ResponseEntity.ok(incomeService.getIncomeByUser(userId));
	}
		
	// Delete income
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("deleteIncome/user/{userId}/income/{incomeId}")
    public ResponseEntity<String> deleteIncome(@PathVariable Integer userId,@PathVariable Integer incomeId) {
		Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

	    CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
	    if (!user.getUserId()
	             .equals(userId)) {
	        throw new AccessDeniedException("Access denied");
	    }
    
        incomeService.deleteIncome(incomeId);
        return ResponseEntity.noContent().build();
    }
	
}
