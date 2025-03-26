package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.UtilityBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilityBillRepository extends JpaRepository<UtilityBill, Integer> {
}
