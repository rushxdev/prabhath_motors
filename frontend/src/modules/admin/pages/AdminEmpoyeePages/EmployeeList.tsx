import { Link, useNavigate } from "react-router-dom";
import { useEmployee } from "../../../../hooks/useEmployee";
import employeeService from "../../../../services/employeeService";
//import { Button } from "@headlessui/react";

const EmployeeList = () => {
  const { employees, setEmployees } = useEmployee(); // Added setEmployees to update state
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(id);
        setEmployees((prev) => prev.filter((emp) => emp.empId !== id)); // Remove from state
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="max-w-screen mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/admin/employee/add")}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Back To Form
        </button>
      </div>
      <div className="mt-4">
        <button onClick={()=>navigate("/admin/employee/add")} className="text-blue-500 hover:underline">
          Back to Add a New Employee
        </button>
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
                    onClick={() => navigate(`/admin/employee/update/${emp.empId}`)}
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
    </div>
  );
};

export default EmployeeList;