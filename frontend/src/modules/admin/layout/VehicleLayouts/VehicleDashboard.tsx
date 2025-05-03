
import Navbar from "../../../user/components/Navbar";
import Sidebar from "../../components/Sidebar";
import VehiclePage from "../../pages/AdminVehiclePages/VehiclePage";

const VehicleDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
          <VehiclePage />
        </div>
      </div>
    </div>
  );
};

export default VehicleDashboard;