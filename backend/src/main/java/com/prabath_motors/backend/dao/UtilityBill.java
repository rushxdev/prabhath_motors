package com.prabath_motors.backend.dao;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
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


        @Column(unique = true, nullable = false)
        private int Billing_Acc_No;

        @Column(nullable = false)
        private String Type;
        private String Address;
        private String Meter_No;
        private float Unit_Price;
}
