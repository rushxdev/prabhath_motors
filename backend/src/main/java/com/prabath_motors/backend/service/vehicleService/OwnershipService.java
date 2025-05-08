package com.prabath_motors.backend.service.vehicleService;

import com.prabath_motors.backend.dao.OwnershipHistory;
import java.util.List;

public interface OwnershipService {
    void transferOwnership(Long vehicleId, String newOwnerName, String newOwnerContact);
    List<OwnershipHistory> getOwnershipHistory(Long vehicleId);
    void clearOwnershipHistory(Long vehicleId);
} 