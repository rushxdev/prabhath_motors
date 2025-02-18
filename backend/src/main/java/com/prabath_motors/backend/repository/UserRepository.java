package com.prabath_motors.backend.repository;

import com.prabath_motors.backend.dao.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> { // Class type and class primary key type for generic types
}
