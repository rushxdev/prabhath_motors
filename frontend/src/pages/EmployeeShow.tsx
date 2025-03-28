import Sidebar from "../components/Sidebar";
import EmployeeNavBar from "../components/EmployeeNavBar";
import EmployeeList from "../components/EmployeeList";

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

