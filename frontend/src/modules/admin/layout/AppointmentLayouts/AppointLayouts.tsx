import React from "react";
import Sidebar from "../../components/Sidebar";
import AppointNav from "./AppointmentNavigation";

interface AppointmentLayoutProps {
  children: React.ReactNode;
}

const AppointLayouts: React.FC<AppointmentLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AppointNav />
        <div className="max-w-full pattern-dots pattern-green-300 dark:pattern-green-950 pattern-bg-white dark:pattern-bg-black pattern-size-2 pattern-opacity-100 min-h-screen p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppointLayouts;