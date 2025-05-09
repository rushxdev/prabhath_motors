import Sidebar from "../../components/Sidebar";
import VehicleNavigation from "../../components/VehicleNavigation";

const VehicleDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <VehicleNavigation />
        <div className="w-full p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default VehicleDashboard;