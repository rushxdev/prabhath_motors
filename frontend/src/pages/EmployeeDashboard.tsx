import EmployeeForm from "../components/EmployeeForm";
import Sidebar from "../components/Sidebar";
import EmployeeNavBar from "../components/EmployeeNavBar";

const EmployeeDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <EmployeeNavBar />
        <div className="max-w-screen mx-auto p-6 bg-gray-100 min-h-screen">
          <EmployeeForm />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

