package com.prabath_motors.backend.service.vehicleService;

import com.prabath_motors.backend.dao.Vehicle;
import com.prabath_motors.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    private void validateVehicle(Vehicle vehicle) {
        // Validate contact number (10 digits only)
        if (!Pattern.matches("^\\d{10}$", vehicle.getContactNo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contact number must be exactly 10 digits");
        }

        // Validate owner name (letters and spaces only)
        if (!Pattern.matches("^[a-zA-Z\\s]+$", vehicle.getOwnerName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner name must contain only letters and spaces");
        }

        // Validate mileage (positive number only)
        if (vehicle.getMileage() == null || vehicle.getMileage() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mileage must be a positive number");
        }
    }

    @Override
    public Vehicle saveVehicle(Vehicle vehicle) {
        validateVehicle(vehicle);
        return vehicleRepository.save(vehicle);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    @Override
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        return vehicleRepository.findById(id).map(vehicle -> {
            validateVehicle(vehicleDetails);
            vehicle.setVehicleRegistrationNo(vehicleDetails.getVehicleRegistrationNo());
            vehicle.setOwnerName(vehicleDetails.getOwnerName());
            vehicle.setContactNo(vehicleDetails.getContactNo());
            vehicle.setMileage(vehicleDetails.getMileage());
            return vehicleRepository.save(vehicle);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
    }

    @Override
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
