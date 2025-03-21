package com.prabath_motors.backend.dao.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private int itemID;
    private int supplierID;
    private int qtyAdded;
    private int qtyInStock;
    private int recorderLevel;
    private double unitPrice;
    private double totalCost;
    private LocalDate dateAdded;
}
