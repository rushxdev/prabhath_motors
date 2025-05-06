package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Stock.Stock_Out;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Stock_OutRepository extends JpaRepository<Stock_Out, Integer> {}
