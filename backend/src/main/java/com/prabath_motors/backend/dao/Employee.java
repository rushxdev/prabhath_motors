package com.prabath_motors.backend.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int empId;

    private String firstname;
    private String lastname;
    private String role;
    private String contact;
    private String nic;
    private String dob;
    private String gender;
    private Double salary;
}
