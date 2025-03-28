import EmployeeForm from "../components/EmployeeForm";
import Navbar from "../modules/user/components/Navbar";
import Sidebar from "../components/Sidebar";

const EmployeeDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
          <EmployeeForm />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

