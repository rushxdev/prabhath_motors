import Sidebar from "../modules/admin/components/Sidebar";
import AppointmentPage from "../modules/admin/pages/AdminAppointmentPages/AppointmentPage";
import Navbar from "../modules/user/components/Navbar";

const AppointmentDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
          <AppointmentPage />
        </div>
      </div>
    </div>
  );
};

export default AppointmentDashboard;
