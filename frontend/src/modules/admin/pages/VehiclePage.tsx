import { useEffect, useState } from "react";
import { Vehicle } from "../../../types/Vehicle";
import { deleteVehicle, getAllVehicles } from "../../../services/vehicleService";
import Navbar from "../../user/components/Navbar";
import { useNavigate } from "react-router-dom";

const VehiclePage = () => {
  const [vehicle, setVehicle] = useState<Vehicle[]>([]);
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    const data = await getAllVehicles();
    setVehicle(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteVehicle(id);
    fetchVehicles();
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Vehicles</h2>
        {/* Search box */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Vehicle Reg. No</th>
              <th className="border p-2">Vehicle Type</th>
              <th className="border p-2">Owner Name</th>
              <th className="border p-2">Contact No.</th>
              <th className="border p-2">Mileage</th>
              <th className="border p-2">Last Updated Time</th> {/* New column */}
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicle.map((vehicle) => (
              <tr key={vehicle.id} className="text-center">
                <td className="border p-2">{vehicle.vehicleRegistrationNo}</td>
                <td className="border p-2">{vehicle.vehicleType}</td>
                <td className="border p-2">{vehicle.ownerName}</td>
                <td className="border p-2">{vehicle.contactNo}</td>
                <td className="border p-2">{vehicle.mileage}</td>
                <td className="border p-2">{vehicle.lastUpdate}</td> {/* Display Last Updated Time */}
                <td className="border p-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() =>
                      navigate(`update-vehicle/${vehicle.id}`)
                    }
                  >
                    Assign Job
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() =>
                      navigate(`vehicle-update/${vehicle.id}`)
                    }
                  >
                    Update {/* Changed from Reschedule to Update */}
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id!)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclePage;
