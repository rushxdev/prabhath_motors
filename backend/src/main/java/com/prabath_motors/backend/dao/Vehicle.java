package com.prabath_motors.backend.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private int vehicleId;

    @Column(nullable = false)
    private String vehicleRegistrationNo;

    @Column(nullable = false)
    private String vehicleType;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String contactNo;

    @Column(nullable = false)
    private Double mileage;

    @Column(nullable = false)
    private LocalTime lastUpdate;

}
