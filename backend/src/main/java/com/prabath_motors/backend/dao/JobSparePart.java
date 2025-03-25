package com.prabath_motors.backend.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_spare_parts")
public class JobSparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sparePartId;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private String sparePartName;

    @Column(nullable = false)
    private int quantity;


}
