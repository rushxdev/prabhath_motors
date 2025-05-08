package com.prabath_motors.backend.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

import com.prabath_motors.backend.validation.MinAge;

import java.time.LocalDate;

@Data
public class EmployeeDTO {
        @NotBlank(message = "First name is required")
        private String firstname;

        @NotBlank(message = "Last name is required")
        private String lastname;

        @Pattern(regexp = "Operational Manager|Supervisor|Mechanic|Store Keeper|Cashier|HR", message = "Invalid role")
        private String role;

        @Pattern(regexp = "^(\\+94|0)[0-9]{9}$", message = "Contact number is invalid")
        private String contact;

        @Pattern(regexp = "^(\\d{12}|\\d{9}[vVxX])$", message = "NIC must be 12 digits OR 9 digits followed by V/v/X/x")
        private String nic;

        @NotNull(message = "Date of Birth is required")
        @Past(message = "Date of Birth must be in the past")
        @MinAge(value = 17, message = "Employee must be at least 17 years old")
        private LocalDate dob;

        @Pattern(regexp = "Male|Female|Other", message = "Gender must be Male, Female, or Other")
        private String gender;

        @NotNull(message = "Salary is required")
        @Positive(message = "Salary must be positive")
        private Double salary;
}
