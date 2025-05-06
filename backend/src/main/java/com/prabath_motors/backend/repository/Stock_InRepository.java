package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Stock.Stock_In;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Stock_InRepository extends JpaRepository<Stock_In, Integer> {}