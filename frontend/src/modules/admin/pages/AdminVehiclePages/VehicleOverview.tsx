import React, { useEffect, useState } from "react";
import { getAllVehicles } from "../../../../services/vehicleService";
import { Vehicle } from "../../../../types/Vehicle";
import { FaCar, FaCarSide, FaCrown, FaTachometerAlt } from "react-icons/fa";

const VehicleOverview: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllVehicles().then((data) => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  // Count by type
  const typeCounts: Record<string, number> = {};
  vehicles.forEach((v) => {
    typeCounts[v.vehicleType] = (typeCounts[v.vehicleType] || 0) + 1;
  });

  // Example data for other metrics (replace with real data as needed)
  const vehicleGrowth = 5; // percent

  // Calculate this month's added vehicles
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const vehiclesThisMonth = vehicles.filter(v => {
    if (!v.createdAt) return false;
    const date = new Date(v.createdAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  // Most popular vehicle type
  let mostPopularType = "-";
  let mostPopularCount = 0;
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > mostPopularCount) {
      mostPopularType = type;
      mostPopularCount = count;
    }
  });

  // Average mileage
  const avgMileage = vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + (v.mileage || 0), 0) / vehicles.length) : 0;

  return (
    <div className="px-8 py-8">
      <h2 className="text-2xl font-bold mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Vehicles */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between relative min-h-[160px]">
          <span className="text-gray-500 font-medium">Total Vehicles</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-bold">{vehicles.length}</span>
            <span className="absolute top-4 right-4 bg-blue-50 p-2 rounded-xl">
              <FaCar className="text-blue-400 text-2xl" />
            </span>
          </div>
          <span className="text-green-600 text-sm mt-2">+{vehicleGrowth}% from last month</span>
        </div>
        {/* Added This Month */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between relative min-h-[160px]">
          <span className="text-gray-500 font-medium">Added This Month</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-bold">{vehiclesThisMonth.length}</span>
            <span className="absolute top-4 right-4 bg-blue-50 p-2 rounded-xl">
              <FaCarSide className="text-blue-400 text-2xl" />
            </span>
          </div>
          <span className="text-gray-500 text-sm mt-2">{now.toLocaleString('default', { month: 'long' })} {thisYear}</span>
        </div>
        {/* Top Vehicle Type */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between relative min-h-[160px]">
          <span className="text-gray-500 font-medium">Top Vehicle Type</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-bold">{mostPopularType}</span>
            <span className="absolute top-4 right-4 bg-blue-50 p-2 rounded-xl">
              <FaCrown className="text-blue-400 text-2xl" />
            </span>
          </div>
          <span className="text-gray-500 text-sm mt-2">{mostPopularCount} vehicles</span>
        </div>
        {/* Average Mileage */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between relative min-h-[160px]">
          <span className="text-gray-500 font-medium">Average Mileage</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-bold">{avgMileage} KM</span>
            <span className="absolute top-4 right-4 bg-blue-50 p-2 rounded-xl">
              <FaTachometerAlt className="text-blue-400 text-2xl" />
            </span>
          </div>
          <span className="text-gray-500 text-sm mt-2">Across all vehicles</span>
        </div>
      </div>
      {/* Vehicles by Category */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Vehicles by Category</h3>
        <ul className="flex flex-wrap gap-6">
          {Object.entries(typeCounts).map(([type, count]) => (
            <li key={type} className="bg-white rounded-xl shadow p-4 min-w-[160px] text-center">
              <span className="block text-gray-500 text-sm mb-1">{type}</span>
              <span className="text-xl font-bold text-green-700">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VehicleOverview; 