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
public class Stock_Out {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stockOutID;
    private int itemID;
    private int jobID;
    private int vehicleID;
    private int qtyUsed;
    private double soldPrice;
    private LocalDate dateUsed;
}
