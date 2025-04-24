import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import employeeService from "../../../../services/employeeService";
import { Employee } from "../../../../types/Employee";

const EmployeeEdit = () => {
  const { id } = useParams<{ id: string }>(); // Get employee ID from URL
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      employeeService
        .getEmployeeById(Number(id))
        .then((res) => {
          setEmployee(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching employee:", err);
          setError("Failed to fetch employee data.");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!employee) return;
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !employee.empId) {
      setError("Invalid employee data.");
      return;
    }

    try {
      const updatedEmployee = await employeeService.updateEmployee(employee.empId, employee);
      if (!updatedEmployee) {
        throw new Error("Update failed");
      }
      alert("Employee updated successfully!");
      navigate("/admin/employee/getAll");
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee. Please try again.");
    }
  };

  if (loading) return <p>Loading employee data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input type="text" name="firstname" value={employee.firstname} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" name="lastname" value={employee.lastname} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={employee.role} onChange={handleChange} className="border p-2 w-full">
            <option value="Operational Manager">Operational Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Mechanic">Mechanic</option>
            <option value="Store Keeper">Store Keeper</option>
            <option value="Cashier">Cashier</option>
            <option value="HR">HR</option>
          </select>
        </div>
        <div>
          <label>Contact</label>
          <input type="text" name="contact" value={employee.contact} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>NIC</label>
          <input type="text" name="nic" value={employee.nic} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Gender</label>
          <select name="gender" value={employee.gender} onChange={handleChange} className="border p-2 w-full">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Salary</label>
          <input type="number" name="salary" value={employee.salary} onChange={handleChange} className="border p-2 w-full" />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Update Employee</button>
      </form>
    </div>
  );
};

export default EmployeeEdit;