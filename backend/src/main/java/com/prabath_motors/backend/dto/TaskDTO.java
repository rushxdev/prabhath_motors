package com.prabath_motors.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    
    private Long id;
    
    @NotBlank(message = "Task description is required")
    @Size(min = 3, max = 255, message = "Description must be between 3 and 255 characters")
    private String description;
    
    @NotNull(message = "Cost is required")
    @Min(value = 0, message = "Cost must be a positive number")
    private Double cost;
}
