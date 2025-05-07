package com.prabath_motors.backend.service.appointmentService;

import com.prabath_motors.backend.dao.Appointment.Task;

import java.util.List;
import java.util.Optional;

public interface TaskService {

    Task saveTask(Task task);
    List<Task> getAllTasks();
    Optional<Task> getTaskById(Long id);
    Task updateTask(Long id, Task taskDetails);
    void deleteTask(Long id);
}
