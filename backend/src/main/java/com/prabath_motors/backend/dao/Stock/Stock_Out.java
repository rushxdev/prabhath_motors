package com.prabath_motors.backend.dao.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Stock_Out {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stockOutID;
    
    @NotNull(message = "Item ID is required")
    @Min(value = 1, message = "Item ID must be positive")
    private int itemID;
    
    @NotNull(message = "Job ID is required")
    @Min(value = 1, message = "Job ID must be positive")
    private int jobID;
    
    @NotNull(message = "Vehicle ID is required")
    @Min(value = 1, message = "Vehicle ID must be positive")
    private int vehicleID;
    
    @Min(value = 1, message = "Quantity used must be at least 1")
    private int qtyUsed;
    
    @DecimalMin(value = "0.01", message = "Sold price must be greater than 0")
    private double soldPrice;
    
    @NotNull(message = "Date used is required")
    @PastOrPresent(message = "Date used cannot be in the future")
    private LocalDate dateUsed;
}