package com.example.demo.service;

import java.util.List;
import com.example.demo.entities.Income;

public interface IncomeService {
	Income saveIncome(Income income);
    List<Income> getIncomeByUser(Integer userId);
    void deleteIncome(Integer incomeId);
 
}


