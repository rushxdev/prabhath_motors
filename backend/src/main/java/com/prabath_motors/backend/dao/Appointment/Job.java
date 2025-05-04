package com.prabath_motors.backend.dao.Appointment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String jobId;

    @Column(nullable = false)
    private String vehicleRegistrationNumber; //auto fetch from appointment

    @Column(nullable = false)
    private String serviceSection;

    @Column(nullable = false)
    private String assignedEmployee;

    @ElementCollection
    private List<String> tasks; //Multiple tasks assigned to a job

    @ElementCollection
    private List<String> spareParts;

    @Column(nullable = false)
    private String status; //Ongoing or Done


    private double totalCost; //Ongoing or Done
}
