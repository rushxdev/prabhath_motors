import React, { useState } from "react";
import { Vehicle } from "../../../types/Vehicle";
import Navbar from "../components/Navbar";
import { addVehicle } from "../../../services/vehicleService";
import { useNavigate } from "react-router-dom";

const VehicleRegistration = () => {
  const [vehicle, setVehicle] = useState<Vehicle>({
    vehicleId: 0,
    vehicleRegistrationNo: "",
    vehicleType: "",
    ownerName: "",
    contactNo: "",
    mileage: 0,
    lastUpdate: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle({
        ...vehicle,
        mileage: parseFloat(vehicle.mileage.toString()),
      });
      alert("Vehicle registered successfully");
      setVehicle({
        vehicleId: 0,
        vehicleRegistrationNo: "",
        vehicleType: "",
        ownerName: "",
        contactNo: "",
        mileage: 0,
        lastUpdate: "",
      });
      navigate("/");
    } catch (error) {
      console.error("Error while registering vehicle", error);
      alert("Failed to register vehicle");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Register Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Registration No */}
          <input
            type="text"
            name="vehicleRegistrationNo"
            placeholder="Vehicle Registration No."
            value={vehicle.vehicleRegistrationNo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          {/* Vehicle Type */}
          <input
            type="text"
            name="vehicleType"
            placeholder="Vehicle Type"
            value={vehicle.vehicleType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          {/* Owner Name */}
          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            value={vehicle.ownerName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          {/* Contact No */}
          <input
            type="text"
            name="contactNo"
            placeholder="Contact No."
            value={vehicle.contactNo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          {/* Mileage */}
          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={vehicle.mileage}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          {/* Last Update (Time) */}
          <input
            type="time"
            name="lastUpdate"
            value={vehicle.lastUpdate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Register Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleRegistration;