import React from "react";
import Sidebar from "../../components/Sidebar";
import EmployeeNavBar from "../../components/AdminEmployee-pages/EmployeeNavBar";

interface EmployeeManagerLayoutProps {
  children: React.ReactNode;
}

const EmployeeManagerLayout: React.FC<EmployeeManagerLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <EmployeeNavBar />
        <div className="max-w-screen mx-auto p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagerLayout;
