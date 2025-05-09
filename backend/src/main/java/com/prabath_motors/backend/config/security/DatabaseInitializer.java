package com.prabath_motors.backend.config.security;

import com.prabath_motors.backend.dao.auth.ERole;
import com.prabath_motors.backend.dao.auth.Role;
import com.prabath_motors.backend.dao.auth.User;
import com.prabath_motors.backend.repository.auth.RoleRepository;
import com.prabath_motors.backend.repository.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

    @Component
    public class DatabaseInitializer implements CommandLineRunner {

        @Autowired
        private RoleRepository roleRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
            // Initialize roles if they don't exist
            if (roleRepository.count() == 0) {
                Role userRole = new Role();
                userRole.setName(ERole.ROLE_USER);
                roleRepository.save(userRole);

                Role adminRole = new Role();
                adminRole.setName(ERole.ROLE_ADMIN);
                roleRepository.save(adminRole);

                System.out.println("Roles initialized successfully");
            }

            // Create default admin user if it doesn't exist
            if (!userRepository.existsByUsername("admin")) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@prabathmotors.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));

                Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));
                roles.add(adminRole);

                adminUser.setRoles(roles);
                userRepository.save(adminUser);

                System.out.println("Default admin user created successfully");
            }
        }
    }

