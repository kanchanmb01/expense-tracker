package com.example.demo.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   
@NoArgsConstructor      
@AllArgsConstructor 
@Entity
@Table(name = "income")     
public class Income {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer incomeId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;   // Foreign key reference to users table

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // Foreign key reference to categories table

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private Double amount;

    @Column(name = "income_date")
    private LocalDate incomeDate;


    @Size(max = 255, message = "Notes cannot exceed 255 characters")
    private String notes;

    @Column(name = "created_at",updatable = false)     
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
