package com.prabath_motors.backend.service.userService;


import com.prabath_motors.backend.dao.Employee;
import com.prabath_motors.backend.repository.EmployeeRepository;
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
    public Employee updateEmployee(Employee employee) {
        Optional<Employee> existingEmployee = employeeRepository.findById(employee.getEmpId());
        if (existingEmployee.isPresent()) {
            Employee updatedEmployee = existingEmployee.get();
            updatedEmployee.setFirstname(employee.getFirstname());
            updatedEmployee.setLastname(employee.getLastname());
            updatedEmployee.setRole(employee.getRole());
            updatedEmployee.setContact(employee.getContact());
            updatedEmployee.setNic(employee.getNic());
            updatedEmployee.setDob(employee.getDob());
            updatedEmployee.setGender(employee.getGender());
            updatedEmployee.setSalary(employee.getSalary());
            return employeeRepository.save(updatedEmployee);
        }
        throw new RuntimeException("Employee not found");
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
