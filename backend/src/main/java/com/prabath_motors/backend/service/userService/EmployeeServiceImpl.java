package com.prabath_motors.backend.service.userService;


import com.prabath_motors.backend.dao.Employee;
import com.prabath_motors.backend.dto.EmployeeDTO;
import com.prabath_motors.backend.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Optional<Employee> getEmployeeById(int empId) {
        return employeeRepository.findById(empId);
    }

    @Override
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(int empId, EmployeeDTO dto) {
        Employee existing = employeeRepository.findById(empId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        EmployeeMapper.updateEntity(existing, dto);
        return employeeRepository.save(existing);
    }

    @Override
    public void deleteEmployee(int empId) {
        employeeRepository.deleteById(empId);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

}
