import EmployeeForm from "../modules/admin/components/AdminEmployee-pages/EmployeeForm";
import Sidebar from "../modules/admin/components/Sidebar";
import EmployeeNavBar from "../modules/admin/components/AdminEmployee-pages/EmployeeNavBar";

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

