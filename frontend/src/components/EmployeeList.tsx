import { Link } from "react-router-dom";
import { useEmployee } from "../hooks/useEmployee";

const EmployeeList = () => {
  const { employees } = useEmployee(); // Fetch employees from hook

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      {employees.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">NIC</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.empId} className="border">
                <td className="border p-2 text-center">{emp.empId ?? "N/A"}</td>
                <td className="border p-2">{emp.firstname} {emp.lastname}</td>
                <td className="border p-2">{emp.role}</td>
                <td className="border p-2">{emp.contact}</td>
                <td className="border p-2">{emp.nic}</td>
                <td className="border p-2">{emp.gender}</td>
                <td className="border p-2 text-right">${emp.salary.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No employees found.</p>
      )}

      <div className="mt-4">
        <Link to="/admin/employee/add" className="text-blue-500 hover:underline">Back to Form</Link>
      </div>
    </div>
  );
};

export default EmployeeList;
