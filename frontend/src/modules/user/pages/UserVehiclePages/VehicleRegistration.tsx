import React, { useState, useEffect } from "react";
import { Vehicle } from "../../../../types/Vehicle";
import { addVehicle } from "../../../../services/vehicleService";
import { useNavigate } from "react-router-dom";
import {
  validateVehicleRegistrationNo,
  validateOwnerName,
  validateContactNo,
  validateMileage,
  validateLastUpdate
} from "../../../../hooks/useVehicle";
import Modal from "../../../../components/Model";

const VehicleRegistration = () => {
  const [vehicle, setVehicle] = useState<Vehicle>({
    vehicleId: 0,
    vehicleRegistrationNo: "",
    vehicleType: "",
    ownerName: "",
    contactNo: "",
    contactNumber: "",
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

  const [isOpen, setIsOpen] = useState(true);

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
        contactNumber: vehicle.contactNo,
      });
      alert("Vehicle registered successfully");
      setVehicle({
        vehicleId: 0,
        vehicleRegistrationNo: "",
        vehicleType: "",
        ownerName: "",
        contactNo: "",
        contactNumber: "",
        mileage: 0,
        lastUpdate: getCurrentTime(), // Reset to current time after successful submission
      });
      navigate("/admin/vehicle-page");
    } catch (error) {
      console.error("Error while registering vehicle", error);
      alert("Failed to register vehicle");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/admin/vehicle-page");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary text-center">Register Vehicle</h2>
          <Modal isOpen={isOpen} onClose={handleClose} title="Register Vehicle">
            <form onSubmit={handleSubmit} className="mt-4">
              {/* Vehicle Registration No */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Registration No</label>
                <input
                  type="text"
                  name="vehicleRegistrationNo"
                  placeholder="Vehicle Registration No."
                  value={vehicle.vehicleRegistrationNo}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vehicleRegistrationNo ? 'border-red-500' : ''}`}
                />
                {errors.vehicleRegistrationNo && <p className="mt-1 text-sm text-red-600">{errors.vehicleRegistrationNo}</p>}
              </div>
              {/* Vehicle Type Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={vehicle.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Vehicle Type</option>
                  <option value="Car">CAR</option>
                  <option value="Jeep">JEEP</option>
                  <option value="Van">VAN</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>
              {/* Owner Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  placeholder="Owner Name"
                  value={vehicle.ownerName}
                  onChange={e => {
                    // Only allow letters and spaces
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setVehicle({ ...vehicle, ownerName: value });
                    setErrors({ ...errors, ownerName: validateOwnerName(value) });
                  }}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ownerName ? 'border-red-500' : ''}`}
                />
                {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
              </div>
              {/* Contact No */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact No</label>
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Contact No."
                  value={vehicle.contactNo}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setVehicle({ ...vehicle, contactNo: value });
                    setErrors({ ...errors, contactNo: validateContactNo(value) });
                  }}
                  required
                  maxLength={10}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactNo ? 'border-red-500' : ''}`}
                />
                {errors.contactNo && <p className="mt-1 text-sm text-red-600">{errors.contactNo}</p>}
              </div>
              {/* Mileage */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                <input
                  type="number"
                  name="mileage"
                  placeholder="Mileage"
                  value={vehicle.mileage}
                  onChange={e => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setVehicle({ ...vehicle, mileage: value === '' ? '' : parseInt(value, 10) });
                    setErrors({ ...errors, mileage: validateMileage(value === '' ? 0 : parseInt(value, 10)) });
                  }}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mileage ? 'border-red-500' : ''}`}
                />
                {errors.mileage && <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>}
              </div>
              {/* Last Update (Time) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Update (Time)</label>
                <input
                  type="time"
                  name="lastUpdate"
                  value={vehicle.lastUpdate}
                  readOnly
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastUpdate ? 'border-red-500' : ''}`}
                />
                {errors.lastUpdate && <p className="mt-1 text-sm text-red-600">{errors.lastUpdate}</p>}
              </div>
              {/* Form Actions */}
              <div className="flex justify-end mt-8 gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-700 transition"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default VehicleRegistration;
