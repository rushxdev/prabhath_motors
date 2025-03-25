package com.prabath_motors.backend.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Employee {
    @Id
    @GeneratedValue
    private int empId;
    private String name;
    private String role;
    private String address;
    private String contact;
    private String nic;
    private String dob;
}
