package com.prabath_motors.backend.dao;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UtilityBill {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @NotNull(message = "Billing Account Number is required")
        @Min(value = 1, message = "Billing Account Number must be a positive number")
        @Column(unique = true, nullable = false)
        private int Billing_Acc_No;

        @NotBlank(message = "Utility type is required")
        @Pattern(regexp = "^(Electricity|Water|Internet|Telephone|Other)$", 
                message = "Type must be one of: Electricity, Water, Internet, Telephone, Other")
        @Column(nullable = false)
        private String Type;

        @Size(max = 255, message = "Address must be less than 255 characters")
        private String Address;

        @Size(min = 3, max = 50, message = "Meter number must be between 3 and 50 characters")
        private String Meter_No;

        @DecimalMin(value = "0.01", message = "Unit price must be greater than 0")
        @DecimalMax(value = "10000.00", message = "Unit price must be less than 10000")
        private float Unit_Price;
}
