package com.prabath_motors.backend.service.userService;


import com.prabath_motors.backend.dao.Employee;
import com.prabath_motors.backend.dto.EmployeeDTO;

public class EmployeeMapper {
    public static Employee toEntity(EmployeeDTO dto) {
        Employee emp = new Employee();
        emp.setFirstname(dto.getFirstname());
        emp.setLastname(dto.getLastname());
        emp.setRole(dto.getRole());
        emp.setContact(dto.getContact());
        emp.setNic(dto.getNic());
        emp.setDob(dto.getDob());
        emp.setGender(dto.getGender());
        emp.setSalary(dto.getSalary());
        return emp;
    }

    public static void updateEntity(Employee emp, EmployeeDTO dto) {
        emp.setFirstname(dto.getFirstname());
        emp.setLastname(dto.getLastname());
        emp.setRole(dto.getRole());
        emp.setContact(dto.getContact());
        emp.setNic(dto.getNic());
        emp.setDob(dto.getDob());
        emp.setGender(dto.getGender());
        emp.setSalary(dto.getSalary());
    }
}
