import { Link } from "react-router-dom";
import { useState } from "react";
import { Employee } from "../types/Employee";
import { useEmployee } from "../hooks/useEmployee";
import employeeService from "../services/employeeService";
import EditEmployeeModal from "./EditEmployeeModal";

const EmployeeList = () => {
  const { employees, setEmployees } = useEmployee();
  
  // State for modal and form
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(id);
        setEmployees((prev) => prev.filter((emp) => emp.empId !== id));
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const openEditModal = (employee: Employee) => {
    setCurrentEmployee({ ...employee });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (currentEmployee) {
      setCurrentEmployee({
        ...currentEmployee,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleUpdateEmployee = async () => {
    if (currentEmployee && currentEmployee.empId) {
      try {
        const updatedEmployee = await employeeService.updateEmployee(
          currentEmployee.empId, 
          currentEmployee
        );

        setEmployees((prev) => 
          prev.map((emp) => 
            emp.empId === currentEmployee.empId ? updatedEmployee : emp
          )
        );

        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    }
  };

  return (
    <div className="max-w-screen mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      <div className="mt-4">
        <Link to="/admin/employee/add" className="text-blue-500 hover:underline">
          Add a New Employee
        </Link>
      </div>

      {employees.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">NIC</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Salary</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.empId} className="border">
                <td className="border p-2 text-center">{emp.empId ?? "N/A"}</td>
                <td className="border p-2">{emp.firstname} {emp.lastname}</td>
                <td className="border p-2">{emp.role}</td>
                <td className="border p-2">{emp.contact}</td>
                <td className="border p-2">{emp.nic}</td>
                <td className="border p-2">{emp.gender}</td>
                <td className="border p-2 text-right">Rs.{emp.salary.toFixed(2)}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button 
                    onClick={() => openEditModal(emp)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => emp.empId !== undefined && handleDelete(emp.empId)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No employees found.</p>
      )}

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        employee={currentEmployee}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateEmployee}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default EmployeeList;
