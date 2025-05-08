package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.OwnershipHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OwnershipHistoryRepository extends JpaRepository<OwnershipHistory, Long> {
    List<OwnershipHistory> findByVehicleIdOrderByTransferDateDesc(Long vehicleId);
} 