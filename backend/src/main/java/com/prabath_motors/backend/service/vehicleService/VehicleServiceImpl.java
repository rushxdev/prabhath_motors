package com.prabath_motors.backend.service.vehicleService;

import com.prabath_motors.backend.dao.Vehicle;
import com.prabath_motors.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public Vehicle saveVehicle(Vehicle vehicle) { return vehicleRepository.save(vehicle); }

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
            vehicle.setVehicleRegistrationNo(vehicleDetails.getVehicleRegistrationNo());
            vehicle.setOwnerName(vehicleDetails.getOwnerName());
            vehicle.setContactNo(vehicleDetails.getContactNo());
            vehicle.setMileage(vehicleDetails.getMileage());
            return  vehicleRepository.save(vehicle);
        }).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    @Override
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }


}
