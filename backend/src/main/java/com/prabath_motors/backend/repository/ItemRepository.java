package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.Stock.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//Spring Data JPA repository to interact with the database
@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {}