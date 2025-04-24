import Sidebar from "../../../../modules/admin/components/Sidebar";
import EmployeeNavBar from "../../../../modules/admin/components/AdminEmployee-pages/EmployeeNavBar";
import EmployeeList from "../../../../modules/admin/pages/AdminEmpoyeePages/EmployeeList";

const EmployeeShow = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <EmployeeNavBar />
        <div className="max-w-screen mx-auto p-6 bg-gray-100 min-h-screen">
          <EmployeeList />
        </div>
      </div>
    </div>
  );
};

export default EmployeeShow;

