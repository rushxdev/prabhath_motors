package com.prabath_motors.backend.dao.Appointment;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class NamedCostItem {
    private Long itemId; // Added ID field for both tasks and spare parts
    private String name;
    private double cost;
}
