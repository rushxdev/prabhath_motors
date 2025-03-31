package com.prabath_motors.backend.service.vehicleService;

import com.prabath_motors.backend.dao.Vehicle;

import java.util.List;
import java.util.Optional;

public interface VehicleService {

    Vehicle saveVehicle(Vehicle vehicle);
    List<Vehicle> getAllVehicles();
    Optional<Vehicle> getVehicleById(Long id);
    Vehicle updateVehicle(Long id, Vehicle vehicleDetails);
    void deleteVehicle(Long id);
}
