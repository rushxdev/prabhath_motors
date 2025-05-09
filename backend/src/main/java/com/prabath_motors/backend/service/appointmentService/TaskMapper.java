package com.prabath_motors.backend.service.appointmentService;

import com.prabath_motors.backend.dao.Appointment.Task;
import com.prabath_motors.backend.dto.TaskDTO;

public class TaskMapper {
    
    /**
     * Convert DTO to Entity
     */
    public static Task toEntity(TaskDTO dto) {
        Task task = new Task();
        
        if (dto.getId() != null) {
            task.setId(dto.getId());
        }
        
        task.setDescription(dto.getDescription());
        task.setCost(dto.getCost());
        
        return task;
    }
    
    /**
     * Convert Entity to DTO
     */
    public static TaskDTO toDTO(Task entity) {
        TaskDTO dto = new TaskDTO();
        
        dto.setId(entity.getId());
        dto.setDescription(entity.getDescription());
        dto.setCost(entity.getCost());
        
        return dto;
    }
}
