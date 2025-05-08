package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Appointment.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
