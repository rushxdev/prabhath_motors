package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Stock.Item_Ctgry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Item_CtgryRepository extends JpaRepository<Item_Ctgry, Integer> {
}
