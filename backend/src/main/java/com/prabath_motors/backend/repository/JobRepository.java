package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Appointment.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Job findByJobId(String jobId);
}
