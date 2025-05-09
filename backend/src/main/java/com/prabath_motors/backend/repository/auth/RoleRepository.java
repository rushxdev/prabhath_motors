package com.prabath_motors.backend.repository.auth;

import com.prabath_motors.backend.dao.auth.ERole;
import com.prabath_motors.backend.dao.auth.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
