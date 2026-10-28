package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.Income;

public interface IncomeRepository extends JpaRepository<Income, Integer> {
	List<Income> findByUser_UserId(Integer userId);

}
