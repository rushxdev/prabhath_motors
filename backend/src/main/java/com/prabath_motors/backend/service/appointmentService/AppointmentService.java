package com.prabath_motors.backend.service.appointmentService;

import com.prabath_motors.backend.dao.Appointment.Appointment;

import java.util.List;
import java.util.Optional;

public interface AppointmentService {

    Appointment saveAppointment(Appointment appointment);
    List<Appointment> getAllAppointments();
    Optional<Appointment> getAppointmentById(Long id);
    Appointment updateAppointment(Long id, Appointment appointmentDetails);
    void deleteAppointment(Long id);
}
