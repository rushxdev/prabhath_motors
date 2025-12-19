import React from "react";
import Sidebar from "../../components/Sidebar";
import AppointmentContent from "../../components/AdminAppointment-pages/AppointmentContent";

interface AppointmentLayoutProps {
  children: React.ReactNode;
}

const AppointLayouts: React.FC<AppointmentLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <AppointmentContent>{children}</AppointmentContent>
    </div>
  );
};

export default AppointLayouts;