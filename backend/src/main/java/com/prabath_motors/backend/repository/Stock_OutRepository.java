package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Stock.Stock_Out;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface Stock_OutRepository extends JpaRepository<Stock_Out, Integer> {
    List<Stock_Out> findByDateUsedBetween(LocalDate startDate, LocalDate endDate);
}
