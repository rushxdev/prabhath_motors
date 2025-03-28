import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleById, updateVehicle } from "../../../services/vehicleService";
import { useVehicleValidation } from "../../../hooks/useVehicle";
import Navbar from "../../user/components/Navbar";
import { Vehicle } from "../../../types/Vehicle";

const VehicleUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle>({
    vehicleId: 0,
    vehicleRegistrationNo: "",
    vehicleType: "",
    ownerName: "",
    contactNo: "",
    mileage: 0,
    lastUpdate: "",
  });

  // Loading state to avoid empty rendering
  const [loading, setLoading] = useState(true);

  // Use the validation hook
  const { 
    errors, 
    validateField, 
    validateForm,  
  } = useVehicleValidation();

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
        lastUpdate: data.lastUpdate || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error while fetching vehicle", error);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update vehicle state
    setVehicle(prevVehicle => ({
      ...prevVehicle, 
      [name]: name === 'mileage' ? Number(value) : value
    }));

    // Validate the field
    validateField(name, name === 'mileage' ? Number(value) : value);
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

    // Validate entire form before submission
    if (validateForm(vehicle)) {
      try {
        await updateVehicle(idNumber, vehicle);
        navigate("/vehicle-page");
      } catch (error) {
        console.error("Error while updating vehicle", error);
      }
    }
  };

  // Add loading check to render the form only when data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Update Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="vehicleRegistrationNo"
              placeholder="Vehicle Registration No."
              value={vehicle.vehicleRegistrationNo}
              onChange={handleChange}
              readOnly
              className="w-full p-2 border rounded"
            />
            {errors.vehicleRegistrationNo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vehicleRegistrationNo}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="vehicleType"
              placeholder="Vehicle Type"
              value={vehicle.vehicleType}
              onChange={handleChange}
              readOnly
              className="w-full p-2 border rounded"
            />
            {errors.vehicleType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vehicleType}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={vehicle.ownerName}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${errors.ownerName ? 'border-red-500' : ''}`}
            />
            {errors.ownerName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ownerName}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="contactNo"
              placeholder="Contact No."
              value={vehicle.contactNo}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${errors.contactNo ? 'border-red-500' : ''}`}
            />
            {errors.contactNo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNo}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="mileage"
              placeholder="Mileage"
              value={vehicle.mileage}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${errors.mileage ? 'border-red-500' : ''}`}
            />
            {errors.mileage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mileage}
              </p>
            )}
          </div>

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