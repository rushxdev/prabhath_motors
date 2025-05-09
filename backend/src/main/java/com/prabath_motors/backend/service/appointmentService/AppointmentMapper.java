package com.prabath_motors.backend.service.appointmentService;

import com.prabath_motors.backend.dao.Appointment.Appointment;
import com.prabath_motors.backend.dto.AppointmentDTO;

public class AppointmentMapper {
    
    /**
     * Convert DTO to Entity
     */
    public static Appointment toEntity(AppointmentDTO dto) {
        Appointment appointment = new Appointment();
        
        if (dto.getId() != null) {
            appointment.setId(dto.getId());
        }
        
        appointment.setVehicleRegistrationNo(dto.getVehicleRegistrationNo());
        appointment.setDate(dto.getDate());
        appointment.setTime(dto.getTime());
        appointment.setMileage(dto.getMileage());
        
        return appointment;
    }
    
    /**
     * Convert Entity to DTO
     */
    public static AppointmentDTO toDTO(Appointment entity) {
        AppointmentDTO dto = new AppointmentDTO();
        
        dto.setId(entity.getId());
        dto.setVehicleRegistrationNo(entity.getVehicleRegistrationNo());
        dto.setDate(entity.getDate());
        dto.setTime(entity.getTime());
        dto.setMileage(entity.getMileage());
        
        return dto;
    }
}
