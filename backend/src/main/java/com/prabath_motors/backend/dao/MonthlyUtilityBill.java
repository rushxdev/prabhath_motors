package com.prabath_motors.backend.dao;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
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

public class MonthlyUtilityBill {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @Column(unique = true)
        private int invoiceNo;

        @Column(nullable = false)
        private int billingAccNo;

        @Column(nullable = false)
        private String billingMonth;

        @Column(nullable = false)
        private int billingYear;

        private int units;
        private float totalPayment;
        private LocalDate generatedDate;
}
