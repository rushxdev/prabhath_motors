import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Model";
import { Employee } from "../../../../types/Employee";
import employeeService from "../../../../services/employeeService";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmployee?: Employee;
  refreshData: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  currentEmployee,
  refreshData,
}) => {
  const initialState: Omit<Employee, "empId"> = {
    firstname: "",
    lastname: "",
    role: "",
    contact: "",
    nic: "",
    dob: "",
    gender: "",
    salary: 0,
  };

  const [employee, setEmployee] = useState<Omit<Employee, "empId">>(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentEmployee) {
      setEmployee({
        firstname: currentEmployee.firstname,
        lastname: currentEmployee.lastname,
        role: currentEmployee.role,
        contact: currentEmployee.contact,
        nic: currentEmployee.nic,
        dob: currentEmployee.dob,
        gender: currentEmployee.gender,
        salary: currentEmployee.salary,
      });
    } else {
      setEmployee(initialState);
    }
  }, [currentEmployee, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!/^[A-Za-z]+$/.test(employee.firstname)) newErrors.firstname = "First name must contain only letters.";
    if (!/^[A-Za-z]+$/.test(employee.lastname)) newErrors.lastname = "Last name must contain only letters.";
    if (!employee.role) newErrors.role = "Role is required.";
    if (!/^\d{10}$/.test(employee.contact)) newErrors.contact = "Contact must be exactly 10 digits.";
    if (!employee.gender) newErrors.gender = "Gender is required.";
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

    if (!/^(\d{12}|\d{9}V)$/.test(employee.nic)) newErrors.nic = "NIC must be 12 digits OR 9 digits followed by 'V'.";

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

    setIsSubmitting(true);
    try {
      if (currentEmployee?.empId) {
        await employeeService.updateEmployee(currentEmployee.empId, {
          ...employee,
          empId: currentEmployee.empId,
        });
      } else {
        await employeeService.addEmployee(employee);
      }
      refreshData();
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentEmployee ? "Edit Employee" : "Add New Employee"}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstname"
              value={employee.firstname}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              required
            />
            {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={employee.lastname}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              required
            />
            {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={employee.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              required
            >
              <option value="">Select Role</option>
              <option value="Operational Manager">Operational Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Store Keeper">Store Keeper</option>
              <option value="Cashier">Cashier</option>
              <option value="HR">HR</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={employee.contact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              required
            />
            {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NIC</label>
            <input
              type="text"
              name="nic"
              value={employee.nic}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              required
            />
            {errors.nic && <p className="mt-1 text-sm text-red-600">{errors.nic}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={employee.dob}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              required
            />
            {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={employee.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              required
              min="0"
            />
            {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : currentEmployee ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;
