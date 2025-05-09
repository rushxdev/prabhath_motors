import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleById, updateVehicle } from "../../../../services/vehicleService";
import { Vehicle } from "../../../../types/Vehicle"; // Ensure you're importing the Vehicle type

const VehicleUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ Ensure `lastUpdate` is handled and provide a default value
  const [vehicle, setVehicle] = useState<Vehicle>({
    vehicleId: 0,
    vehicleRegistrationNo: "",
    vehicleType: "",
    ownerName: "",
    contactNo: "",
    contactNumber: "", // Added to match Vehicle type
    mileage: 0,
    lastUpdate: "", // Default empty value for lastUpdate
  });

  // Loading state to avoid empty rendering
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVehicleData(id);
    }
  }, [id]);

  const fetchVehicleData = async (vehicleId: string) => {
    try {
      const idNumber = parseInt(vehicleId, 10);
      if (isNaN(idNumber)) {
        console.error("Invalid vehicle id");
        return;
      }
      const data = await getVehicleById(idNumber);
      console.log("Fetched Vehicle Data:", data); // Debug log
      setVehicle({
        ...data,
        contactNumber: data.contactNumber || data.contactNo || "", // Ensure contactNumber is set
        lastUpdate: data.lastUpdate || "", // Ensure fallback if lastUpdate is missing
      });
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error while fetching vehicle", error);
      setLoading(false); // Set loading to false on error
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      console.error("Vehicle id is undefined");
      return;
    }

    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      console.error("Invalid vehicle id");
      return;
    }

    try {
      await updateVehicle(idNumber, vehicle);
      navigate(`/admin/vehicle-page/${id}`);
    } catch (error) {
      console.error("Error while updating vehicle", error);
    }
  };

  // Add loading check to render the form only when data is fetched
  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-2">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4">Update Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="vehicleRegistrationNo"
            placeholder="Vehicle Registration No."
            value={vehicle.vehicleRegistrationNo}
            onChange={handleChange}
            readOnly
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="vehicleType"
            placeholder="Vehicle Type"
            value={vehicle.vehicleType}
            onChange={handleChange}
            readOnly
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            value={vehicle.ownerName}
            onChange={e => {
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              setVehicle({ ...vehicle, ownerName: value });
            }}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="contactNo"
            placeholder="Contact No."
            value={vehicle.contactNo}
            onChange={e => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setVehicle({ ...vehicle, contactNo: value });
            }}
            required
            maxLength={10}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={vehicle.mileage}
            onChange={e => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setVehicle({ ...vehicle, mileage: value === '' ? 0 : parseInt(value, 10) });
            }}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Update Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleUpdate;
