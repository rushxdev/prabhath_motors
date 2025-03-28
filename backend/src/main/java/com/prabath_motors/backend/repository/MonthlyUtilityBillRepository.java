package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.MonthlyUtilityBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthlyUtilityBillRepository extends JpaRepository<MonthlyUtilityBill, Integer> {
}
