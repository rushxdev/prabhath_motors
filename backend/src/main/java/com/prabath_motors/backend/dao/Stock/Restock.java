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
public class Restock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int restockID;
    
    @NotNull(message = "Item ID is required")
    @Min(value = 1, message = "Item ID must be positive")
    private int itemID;
    
    @NotNull(message = "Supplier ID is required")
    @Min(value = 1, message = "Supplier ID must be positive")
    private int supplierID;
    
    @NotBlank(message = "Restock status is required")
    @Pattern(regexp = "^(Pending|In Progress|Completed|Cancelled)$", 
             message = "Status must be one of: Pending, In Progress, Completed, Cancelled")
    private String restockStatus;
    
    @Min(value = 1, message = "Restocked quantity must be at least 1")
    private int restockedQty;
    
    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date cannot be in the future")
    private LocalDate date;
}