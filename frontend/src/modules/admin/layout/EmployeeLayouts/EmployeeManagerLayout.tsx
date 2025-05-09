import React from "react";
import Sidebar from "../../components/Sidebar";
import EmployeeContent from "../../components/AdminEmployee-pages/EmployeeContent";

interface EmployeeManagerLayoutProps {
  children: React.ReactNode;
}

const EmployeeManagerLayout: React.FC<EmployeeManagerLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <EmployeeContent>{children}</EmployeeContent>
    </div>
  );
};

export default EmployeeManagerLayout;
