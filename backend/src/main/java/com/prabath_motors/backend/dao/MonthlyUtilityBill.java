package com.prabath_motors.backend.dao;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
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
public class MonthlyUtilityBill {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @NotNull(message = "Invoice number is required")
        @Min(value = 1, message = "Invoice number must be a positive number")
        @Column(unique = true)
        private int invoiceNo;

        @NotNull(message = "Billing account number is required")
        @Min(value = 1, message = "Billing account number must be a positive number")
        @Column(nullable = false)
        private int billingAccNo;

        @NotBlank(message = "Billing month is required")
        @Pattern(regexp = "^(January|February|March|April|May|June|July|August|September|October|November|December)$", 
                message = "Billing month must be a valid month name")
        @Column(nullable = false)
        private String billingMonth;

        @NotNull(message = "Billing year is required")
        @Min(value = 2000, message = "Billing year must be 2000 or later")
        @Max(value = 2100, message = "Billing year must be 2100 or earlier")
        @Column(nullable = false)
        private int billingYear;

        @Min(value = 0, message = "Units must be a non-negative number")
        private int units;
        
        @DecimalMin(value = "0.01", message = "Total payment must be greater than 0")
        @DecimalMax(value = "1000000.00", message = "Total payment must be less than 1,000,000")
        private float totalPayment;
        
        @PastOrPresent(message = "Generated date cannot be in the future")
        private LocalDate generatedDate;
}
