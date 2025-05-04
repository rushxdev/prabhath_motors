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
public class Restock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int restockID;
    private int itemID;
    private int supplierID;
    private String restockStatus;
    private int restockedQty;
    private LocalDate date;
}