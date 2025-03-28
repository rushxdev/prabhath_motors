import { useNavigate } from "react-router-dom";
import { useEmployee } from "../hooks/useEmployee";

const EmployeeForm = () => {
  const { employee, errors, handleChange, handleSubmit } = useEmployee();
  const navigate = useNavigate(); // Initialize navigation

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e); // Call existing submit function
    navigate("/employees"); // Navigate to employee list page
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add a New Employee</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="text" name="firstname" placeholder="First Name" value={employee.firstname} onChange={handleChange} className="w-full p-2 border rounded" required />
        {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}

        <input type="text" name="lastname" placeholder="Last Name" value={employee.lastname} onChange={handleChange} className="w-full p-2 border rounded" required />
        {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}

        <select name="role" value={employee.role} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Role</option>
          <option value="Operational Manager">Operational Manager</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Store Keeper">Store Keeper</option>
          <option value="Cashier">Cashier</option>
          <option value="HR">HR</option>
        </select>

        <input type="text" name="contact" placeholder="Contact" value={employee.contact} onChange={handleChange} className="w-full p-2 border rounded" required />
        {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}

        <input type="text" name="nic" placeholder="NIC" value={employee.nic} onChange={handleChange} className="w-full p-2 border rounded" required />
        {errors.nic && <p className="text-red-500 text-sm">{errors.nic}</p>}

        <input type="date" name="dob" value={employee.dob} onChange={handleChange} className="w-full p-2 border rounded" required />
        {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}

        <select name="gender" value={employee.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

        <input type="number" name="salary" placeholder="Salary" value={employee.salary} onChange={handleChange} className="w-full p-2 border rounded" required min="0" />
        {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}

        <div className="flex justify-center">
          <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">
            Add an Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
