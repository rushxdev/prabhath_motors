package com.prabath_motors.backend.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @NotBlank(message = "Vehicle registration number is required")
    @Size(min = 5, max = 8, message = "Vehicle registration number must be between 5 and 8 characters")
    private String vehicleRegistrationNo;

    @Column(nullable = false)
    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    @Column(nullable = false)
    @NotBlank(message = "Owner name is required")
    @Size(min = 3, message = "Owner name must be at least 3 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Owner name should only contain letters and spaces")
    private String ownerName;

    @Column(nullable = false)
    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Contact number must be 10 digits")
    private String contactNo;

    @Column(nullable = false)
    @NotNull(message = "Mileage is required")
    @Min(value = 0, message = "Mileage cannot be negative")
    private Double mileage;

    @Column(nullable = false)
    @NotNull(message = "Last update time is required")
    private LocalTime lastUpdate;

}
