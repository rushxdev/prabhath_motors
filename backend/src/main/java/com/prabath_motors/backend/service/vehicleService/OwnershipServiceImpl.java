package com.prabath_motors.backend.service.vehicleService;

import com.prabath_motors.backend.dao.OwnershipHistory;
import com.prabath_motors.backend.dao.Vehicle;
import com.prabath_motors.backend.repository.OwnershipHistoryRepository;
import com.prabath_motors.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OwnershipServiceImpl implements OwnershipService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private OwnershipHistoryRepository ownershipHistoryRepository;

    @Override
    @Transactional
    public void transferOwnership(Long vehicleId, String newOwnerName, String newOwnerContact) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        // Create ownership history record
        OwnershipHistory history = new OwnershipHistory();
        history.setVehicleId(vehicleId);
        history.setPreviousOwnerName(vehicle.getOwnerName());
        history.setPreviousOwnerContact(vehicle.getContactNo());
        history.setNewOwnerName(newOwnerName);
        history.setNewOwnerContact(newOwnerContact);
        history.setTransferDate(LocalDateTime.now());

        // Update vehicle owner information
        vehicle.setOwnerName(newOwnerName);
        vehicle.setContactNo(newOwnerContact);

        // Save changes
        vehicleRepository.save(vehicle);
        ownershipHistoryRepository.save(history);
    }

    @Override
    public List<OwnershipHistory> getOwnershipHistory(Long vehicleId) {
        return ownershipHistoryRepository.findByVehicleIdOrderByTransferDateDesc(vehicleId);
    }

    @Override
    public void clearOwnershipHistory(Long vehicleId) {
        ownershipHistoryRepository.deleteAll(ownershipHistoryRepository.findByVehicleIdOrderByTransferDateDesc(vehicleId));
    }
} 