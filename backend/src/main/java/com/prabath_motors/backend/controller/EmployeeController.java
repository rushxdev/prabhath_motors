package com.prabath_motors.backend.controller;

import com.prabath_motors.backend.dao.Employee;
import com.prabath_motors.backend.dto.EmployeeDTO;
import com.prabath_motors.backend.service.userService.EmployeeMapper;
import com.prabath_motors.backend.service.userService.EmployeeService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import java.util.*;


@RestController
@RequestMapping("/employee")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/add")
    public ResponseEntity<?> addEmployee(@Valid @RequestBody EmployeeDTO dto, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        Employee emp = EmployeeMapper.toEntity(dto);
        return ResponseEntity.ok(employeeService.addEmployee(emp));
    }

    @PutMapping("/update/{empId}")
    public ResponseEntity<?> updateEmployee(@PathVariable int empId,@Valid @RequestBody EmployeeDTO dto, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            Employee updated = employeeService.updateEmployee(empId, dto);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
        }
    }

    @DeleteMapping("/delete/{empId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int empId) {
        employeeService.deleteEmployee(empId);
        return ResponseEntity.ok("Employee deleted successfully");
    }

    @GetMapping("/get/{empId}")
    public Optional<Employee> getEmployee(@PathVariable int empId) {

        return employeeService.getEmployeeById(empId);
    }

    @GetMapping("/getAll")
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }
}
