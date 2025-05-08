package com.prabath_motors.backend.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OwnershipHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long vehicleId;

    @Column(nullable = false)
    private String previousOwnerName;

    @Column(nullable = false)
    private String previousOwnerContact;

    @Column(nullable = false)
    private String newOwnerName;

    @Column(nullable = false)
    private String newOwnerContact;

    @Column(nullable = false)
    private LocalDateTime transferDate;
} 