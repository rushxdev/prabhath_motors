package com.prabath_motors.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    
    private Long id;
    
    @NotBlank(message = "Vehicle registration number is required")
    @Pattern(regexp = "^(?:[A-Z]{2,3}-\\d{4}|\\d{2,3}-\\d{4})$", 
             message = "Invalid vehicle registration number format. Must be in format XX-1234 or XXX-1234 or 12-1234 or 123-1234")
    private String vehicleRegistrationNo;
    
    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Date cannot be in the past")
    private LocalDate date;
    
    @NotNull(message = "Time is required")
    private LocalTime time;
    
    @NotNull(message = "Mileage is required")
    @Min(value = 0, message = "Mileage must be a positive number")
    private Double mileage;
}
