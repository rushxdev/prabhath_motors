package com.prabath_motors.backend.service.userService;

import com.prabath_motors.backend.dao.Employee;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface EmployeeService {
    Optional<Employee> getEmployeeById(int empId);
    Employee addEmployee(Employee employee);
    Employee updateEmployee(int empId, Employee employee);

    void deleteEmployee(int empId);
    List<Employee> getAllEmployees();
}
