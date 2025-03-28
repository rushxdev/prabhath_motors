import { useEffect, useState } from "react";
import { Employee } from "../types/Employee";
import { employeeService } from "../services/employeeService";
import { Link } from "react-router-dom";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Contact</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.empId} className="text-center">
              <td className="border border-gray-300 p-2">{emp.empId}</td>
              <td className="border border-gray-300 p-2">{emp.firstname} {emp.lastname}</td>
              <td className="border border-gray-300 p-2">{emp.role}</td>
              <td className="border border-gray-300 p-2">{emp.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/" className="mt-4 block text-center bg-blue-500 text-white p-2 rounded">
        Add Another Employee
      </Link>
    </div>
  );
};

export default EmployeeListPage;
