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
public class Stock_In {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stockInID;
    
    @NotNull(message = "Item ID is required")
    @Min(value = 1, message = "Item ID must be positive")
    private int itemID;
    
    @NotNull(message = "Category ID is required")
    @Min(value = 1, message = "Category ID must be positive")
    private int ctgryID;
    
    @NotNull(message = "Supplier ID is required")
    @Min(value = 1, message = "Supplier ID must be positive")
    private int supplierID;
    
    @Min(value = 1, message = "Quantity added must be at least 1")
    private int qtyAdded;
    
    @DecimalMin(value = "0.01", message = "Unit price must be greater than 0")
    private double unitPrice;
    
    @DecimalMin(value = "0.01", message = "Sell price must be greater than 0")
    private double sellPrice;
    
    @NotNull(message = "Date added is required")
    @PastOrPresent(message = "Date added cannot be in the future")
    private LocalDate dateAdded;
}