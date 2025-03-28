import { useState, useEffect } from "react";
import { Employee } from "../types/Employee";
import { employeeService } from "../services/employeeService";

export const useEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<Omit<Employee, "empId">>({
    firstname: "",
    lastname: "",
    role: "",
    contact: "",
    nic: "",
    dob: "",
    gender: "",
    salary: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!/^[A-Za-z]+$/.test(employee.firstname)) newErrors.firstname = "First name must contain only letters.";
    if (!/^[A-Za-z]+$/.test(employee.lastname)) newErrors.lastname = "Last name must contain only letters.";
    if (!/^\d{10}$/.test(employee.contact)) newErrors.contact = "Contact must be exactly 10 digits.";
    if (employee.salary < 0) newErrors.salary = "Salary cannot be negative.";

    const today = new Date();
    const minAllowedDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const selectedDate = new Date(employee.dob);
    if (!employee.dob) {
      newErrors.dob = "Date of Birth is required.";
    } else if (selectedDate >= today) {
      newErrors.dob = "Date of Birth cannot be today or a future date.";
    } else if (selectedDate > minAllowedDate) {
      newErrors.dob = "Employee must be at least 17 years old.";
    }
    
    if (!/^(\d{12}|\d{9}V)$/.test(employee.nic)) newErrors.nic = "NIC must be 12 digits OR 10 digits + 'V'.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if ((name === "firstname" || name === "lastname") && !/^[A-Za-z]*$/.test(value)) return;
    if (name === "contact" && !/^\d{0,10}$/.test(value)) return;
    if (name === "nic" && !/^(\d{0,12}|\d{0,9}V?)$/.test(value)) return;

    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await employeeService.createEmployee(employee);
      fetchEmployees();
      setEmployee({ firstname: "", lastname: "", role: "", contact: "", nic: "", dob: "", gender: "", salary: 0 });
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return { employee, employees, errors, handleChange, handleSubmit };
};
