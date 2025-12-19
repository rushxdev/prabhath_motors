package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Stock.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {}