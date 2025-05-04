package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Stock.Restock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestockRepository extends JpaRepository<Restock, Integer> {
}