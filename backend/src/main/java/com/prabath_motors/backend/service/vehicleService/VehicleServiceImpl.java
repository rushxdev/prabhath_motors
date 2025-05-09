package com.prabath_motors.backend.service.vehicleService;

import com.prabath_motors.backend.dao.Vehicle;
import com.prabath_motors.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private void validateVehicle(Vehicle vehicle) {
        // Validate vehicle registration number
        if (vehicle.getVehicleRegistrationNo() == null || vehicle.getVehicleRegistrationNo().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle registration number is required");
        }

        if (vehicle.getVehicleRegistrationNo().length() < 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle registration number must be at least 5 characters");
        }

        if (vehicle.getVehicleRegistrationNo().length() > 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle registration number must be at most 8 characters");
        }

        // Validate vehicle type
        if (vehicle.getVehicleType() == null || vehicle.getVehicleType().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle type is required");
        }

        // Validate owner name
        if (vehicle.getOwnerName() == null || vehicle.getOwnerName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner name is required");
        }

        if (vehicle.getOwnerName().length() < 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner name must be at least 3 characters");
        }

        if (!Pattern.matches("^[a-zA-Z\\s]+$", vehicle.getOwnerName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner name should only contain letters and spaces");
        }

        // Validate contact number
        if (vehicle.getContactNo() == null || vehicle.getContactNo().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contact number is required");
        }

        if (!Pattern.matches("^\\d{10}$", vehicle.getContactNo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contact number must be 10 digits");
        }

        // Validate mileage
        if (vehicle.getMileage() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mileage is required");
        }

        if (vehicle.getMileage() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mileage cannot be negative");
        }

        // Validate lastUpdate
        if (vehicle.getLastUpdate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Last update time is required");
        }

        // Validate time format
        try {
            String timeString = vehicle.getLastUpdate().format(TIME_FORMATTER);
            if (!timeString.matches("^([01]?[0-9]|2[0-3]):[0-5][0-9]$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid time format");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid time format");
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
            // Validate the updated vehicle details
            validateVehicle(vehicleDetails);

            // Update all fields
            vehicle.setVehicleId(vehicleDetails.getVehicleId());
            vehicle.setVehicleRegistrationNo(vehicleDetails.getVehicleRegistrationNo());
            vehicle.setVehicleType(vehicleDetails.getVehicleType());
            vehicle.setOwnerName(vehicleDetails.getOwnerName());
            vehicle.setContactNo(vehicleDetails.getContactNo());
            vehicle.setMileage(vehicleDetails.getMileage());
            vehicle.setLastUpdate(vehicleDetails.getLastUpdate());

            // Save and return the updated vehicle
            return vehicleRepository.save(vehicle);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found with id: " + id));
    }

    @Override
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
