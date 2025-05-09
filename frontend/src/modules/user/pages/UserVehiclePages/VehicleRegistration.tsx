import React, { useState, useEffect } from "react";
import { Vehicle } from "../../../../types/Vehicle";
import Navbar from "../../components/Navbar";
import { addVehicle } from "../../../../services/vehicleService";
import { useNavigate } from "react-router-dom";
import {
  validateVehicleRegistrationNo,
  validateOwnerName,
  validateContactNo,
  validateMileage,
  validateLastUpdate
} from "../../../../hooks/useVehicle";

const VehicleRegistration = () => {
  const [vehicle, setVehicle] = useState<Vehicle>({
    vehicleId: 0,
    vehicleRegistrationNo: "",
    vehicleType: "",
    ownerName: "",
    contactNo: "",
    mileage: 0,
    lastUpdate: "", // will be set dynamically
  });

  const [errors, setErrors] = useState({
    vehicleRegistrationNo: "",
    ownerName: "",
    contactNo: "",
    mileage: "",
    lastUpdate: "",
  });

  const navigate = useNavigate();

  // Function to get current time in HH:mm format
  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Set current time as default for lastUpdate
  useEffect(() => {
    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      lastUpdate: getCurrentTime(),
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });

    // Validate each field in real-time as the user types
    let error = "";
    if (name === "vehicleRegistrationNo") {
      error = validateVehicleRegistrationNo(value);
    } else if (name === "ownerName") {
      error = validateOwnerName(value);
    } else if (name === "contactNo") {
      error = validateContactNo(value);
    } else if (name === "mileage") {
      error = validateMileage(parseFloat(value));
    } else if (name === "lastUpdate") {
      error = validateLastUpdate(value);
    }

    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform final validation before submitting the form
    const vehicleErrors = {
      vehicleRegistrationNo: validateVehicleRegistrationNo(vehicle.vehicleRegistrationNo),
      ownerName: validateOwnerName(vehicle.ownerName),
      contactNo: validateContactNo(vehicle.contactNo),
      mileage: validateMileage(vehicle.mileage),
      // lastUpdate: validateLastUpdate(vehicle.lastUpdate),
    };

    // if (Object.values(vehicleErrors).some((error) => error !== "")) {
    //   setErrors(vehicleErrors);
    //   alert("Please fix the errors in the form.");
    //   return;
    // }

    try {
      await addVehicle({
        ...vehicle,
        vehicleId: parseInt(vehicle.vehicleId.toString()),
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
        lastUpdate: getCurrentTime(), // Reset to current time after successful submission
      });
      navigate("/vehicle-page");
    } catch (error) {
      console.error("Error while registering vehicle", error);
      alert("Failed to register vehicle");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/60 rounded-2xl shadow-2xl p-8 w-full max-w-md mt-10">
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
              className={`w-full p-2 border rounded ${errors.vehicleRegistrationNo ? 'border-red-500' : ''}`}
            />
            {errors.vehicleRegistrationNo && <p className="text-red-500 text-sm">{errors.vehicleRegistrationNo}</p>}

            {/* Vehicle Type Dropdown */}
            <select
              name="vehicleType"
              value={vehicle.vehicleType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Vehicle Type</option> {/* Default option */}
              <option value="Car">CAR</option>
              <option value="Jeep">JEEP</option>
              <option value="Van">VAN</option>
              <option value="SUV">SUV</option>
            </select>
            
            {/* Owner Name */}
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={vehicle.ownerName}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${errors.ownerName ? 'border-red-500' : ''}`}
            />
            {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName}</p>}

            {/* Contact No */}
            <input
              type="text"
              name="contactNo"
              placeholder="Contact No."
              value={vehicle.contactNo}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${errors.contactNo ? 'border-red-500' : ''}`}
            />
            {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo}</p>}

            {/* Mileage */}
            <input
              type="number"
              name="mileage"
              placeholder="Mileage"
              value={vehicle.mileage}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${errors.mileage ? 'border-red-500' : ''}`}
            />
            {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}

            {/* Last Update (Time) */}
            <input
              type="time"
              name="lastUpdate"
              value={vehicle.lastUpdate}
              readOnly
              required
              className={`w-full p-2 border rounded ${errors.lastUpdate ? 'border-red-500' : ''}`}
            />
            {errors.lastUpdate && <p className="text-red-500 text-sm">{errors.lastUpdate}</p>}

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
    </div>
  );
};

export default VehicleRegistration;
