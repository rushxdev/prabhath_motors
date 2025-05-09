package com.prabath_motors.backend.controller.AppointmentController;

import com.prabath_motors.backend.dao.Appointment.Task;
import com.prabath_motors.backend.dto.TaskDTO;
import com.prabath_motors.backend.service.appointmentService.TaskMapper;
import com.prabath_motors.backend.service.appointmentService.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/add")
    public ResponseEntity<?> addTask(@Valid @RequestBody TaskDTO taskDTO, BindingResult result) {
        // Check for validation errors
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        // Convert DTO to entity
        Task task = TaskMapper.toEntity(taskDTO);

        // Save the task
        Task savedTask = taskService.saveTask(task);

        // Convert back to DTO for response
        return ResponseEntity.status(HttpStatus.CREATED).body(TaskMapper.toDTO(savedTask));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Optional<Task> taskOpt = taskService.getTaskById(id);
        if (taskOpt.isPresent()) {
            return ResponseEntity.ok(TaskMapper.toDTO(taskOpt.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found with id: " + id);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @Valid @RequestBody TaskDTO taskDTO, BindingResult result) {
        // Check for validation errors
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            // Convert DTO to entity
            Task taskDetails = TaskMapper.toEntity(taskDTO);

            // Update the task
            Task updatedTask = taskService.updateTask(id, taskDetails);

            // Convert back to DTO for response
            return ResponseEntity.ok(TaskMapper.toDTO(updatedTask));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found with id: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok("Task deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete task: " + e.getMessage());
        }
    }
}
