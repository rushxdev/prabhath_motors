import { useEffect, useState } from "react";
import { Vehicle } from "../../../../types/Vehicle";
import { deleteVehicle, getAllVehicles } from "../../../../services/vehicleService";
import Navbar from "../../../user/components/Navbar";
import { useNavigate } from "react-router-dom";

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    const data = await getAllVehicles();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (!isConfirmed) return;

    await deleteVehicle(id);
    fetchVehicles();
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleRegistrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Vehicles</h2>

        {/* Container for Search bar and Add New button */}
        <div className="flex justify-between items-center mb-4">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {/* Add New button */}
          <button
            onClick={() => navigate(`vehicle-registration`)}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
          >
            Add
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Vehicle Reg. No</th>
              <th className="border p-2">Vehicle Type</th>
              <th className="border p-2">Owner Name</th>
              <th className="border p-2">Contact No.</th>
              <th className="border p-2">Mileage</th>
              <th className="border p-2">Last Updated Time</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="text-center">
                <td className="border p-2">{vehicle.vehicleRegistrationNo}</td>
                <td className="border p-2">{vehicle.vehicleType}</td>
                <td className="border p-2">{vehicle.ownerName}</td>
                <td className="border p-2">{vehicle.contactNo}</td>
                <td className="border p-2">{vehicle.mileage}</td>
                <td className="border p-2">{vehicle.lastUpdate}</td>
                <td className="border p-2 flex justify-start space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => navigate("/admin/job-form", { state: { vehicleId: vehicle.id } })}
                  >
                    Assign Job
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => navigate(`vehicle-update/${vehicle.id}`)}
                  >
                    Update
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
