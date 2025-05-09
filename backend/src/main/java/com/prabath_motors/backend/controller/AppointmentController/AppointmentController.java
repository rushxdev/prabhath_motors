package com.prabath_motors.backend.controller.AppointmentController;

import com.prabath_motors.backend.dao.Appointment.Appointment;
import com.prabath_motors.backend.dto.AppointmentDTO;
import com.prabath_motors.backend.service.appointmentService.AppointmentMapper;
import com.prabath_motors.backend.service.appointmentService.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/appointment")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/add")
    public ResponseEntity<?> addAppointment(@Valid @RequestBody AppointmentDTO appointmentDTO, BindingResult result) {
        // Check for validation errors
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        // Additional validation for date (must be today or in the future)
        if (appointmentDTO.getDate() != null && appointmentDTO.getDate().isBefore(LocalDate.now())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("date", "Date cannot be in the past");
            return ResponseEntity.badRequest().body(errors);
        }

        // Convert DTO to entity
        Appointment appointment = AppointmentMapper.toEntity(appointmentDTO);

        // Save the appointment
        Appointment savedAppointment = appointmentService.saveAppointment(appointment);

        // Convert back to DTO for response
        return ResponseEntity.status(HttpStatus.CREATED).body(AppointmentMapper.toDTO(savedAppointment));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        List<AppointmentDTO> appointmentDTOs = appointments.stream()
                .map(AppointmentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(appointmentDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> appointmentOpt = appointmentService.getAppointmentById(id);
        if (appointmentOpt.isPresent()) {
            return ResponseEntity.ok(AppointmentMapper.toDTO(appointmentOpt.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found with id: " + id);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentDTO appointmentDTO, BindingResult result) {
        // Check for validation errors
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        // Additional validation for date (must be today or in the future)
        if (appointmentDTO.getDate() != null && appointmentDTO.getDate().isBefore(LocalDate.now())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("date", "Date cannot be in the past");
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            // Convert DTO to entity
            Appointment appointmentDetails = AppointmentMapper.toEntity(appointmentDTO);

            // Update the appointment
            Appointment updatedAppointment = appointmentService.updateAppointment(id, appointmentDetails);

            // Convert back to DTO for response
            return ResponseEntity.ok(AppointmentMapper.toDTO(updatedAppointment));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found with id: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok("Appointment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete appointment: " + e.getMessage());
        }
    }
}
