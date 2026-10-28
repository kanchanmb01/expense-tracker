package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entities.Income;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IncomeRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class IncomeServiceImpl implements IncomeService {

	@Autowired
	IncomeRepository incomeRepo;
	
	@Override
	public Income saveIncome(Income income) {
		log.info("Adding income for user {} amount {}", 
				income.getUser().getEmail(), income.getAmount());
		
		return incomeRepo.save(income);
	}

	@Override
	public List<Income> getIncomeByUser(Integer userId) {
		List<Income> incomes=incomeRepo.findByUser_UserId(userId);
		
		log.debug("Income list for user={} Income={}",userId,incomes);
		return incomes;
	}
	
	@Override
	public void deleteIncome(Integer incomeId) {
		log.info("Deleting Income {}", incomeId);
		
		Income income = incomeRepo.findById(incomeId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Income not found with id: " + incomeId));
		incomeRepo.delete(income);

	}

}
