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
    private Long jobId;

    @Column(nullable = false)
    private String vehicleRegistrationNumber; //auto fetch from appointment

    @Column(nullable = false)
    private String serviceSection;

    @Column(nullable = false)
    private Long employeeId;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<JobTask> tasks; //Multiple tasks assigned to a job

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<JobSparePart> spareParts;

    @Column(nullable = false)
    private String status; //Ongoing or Done
}
