import Sidebar from "../../components/Sidebar";
import EmployeeNavBar from "../../components/AdminEmployee-pages/EmployeeNavBar";
import EmployeeEdit  from "../../pages/AdminEmpoyeePages/EmployeeEdit";

const EmployeeUpdate = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <EmployeeNavBar />
        <div className="max-w-screen mx-auto p-6 bg-gray-100 min-h-screen">
          <EmployeeEdit/>
        </div>
      </div>
    </div>
  );
};

export default EmployeeUpdate;