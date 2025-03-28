import { useState } from 'react';
import { Vehicle } from '../types/Vehicle';

// Define validation error interface
export interface VehicleValidationErrors {
  vehicleRegistrationNo: string;
  vehicleType: string;
  ownerName: string;
  contactNo: string;
  mileage: string;
  lastUpdate: string;
}

export const useVehicleValidation = (initialVehicle?: Vehicle) => {
  // Initialize errors state
  const [errors, setErrors] = useState<VehicleValidationErrors>({
    vehicleRegistrationNo: "",
    vehicleType: "",
    ownerName: "",
    contactNo: "",
    mileage: "",
    lastUpdate: "",
  });

  // Validation functions
  const validateVehicleRegistrationNo = (value: string) => {
    const regNoRegex = /^(?:[A-Za-z]{2,3}-\d{4}|[A-Za-z]{2}\s[A-Za-z]{2,3}-\d{4}|\d{2}-\d{4})$/;
    if (!value.trim()) {
      return "Vehicle Registration No. is required";
    }
    if (!value.match(regNoRegex)) {
      return "Vehicle Registration No. should be in the format 'ABC-1234', 'WP ABC-1234', 'WP AB-1234', or '12-3456'.";
    }
    return "";
  };

  const validateVehicleType = (value: string) => {
    const validTypes = ["Car", "Jeep", "Van", "SUV"];
    if (!value) {
      return "Vehicle Type is required";
    }
    if (!validTypes.includes(value)) {
      return "Invalid vehicle type";
    }
    return "";
  };

  const validateOwnerName = (value: string) => {
    const ownerNameRegex = /^[A-Za-z\s]+$/;
    if (!value.trim()) {
      return "Owner Name is required";
    }
    if (!value.match(ownerNameRegex)) {
      return "Owner Name cannot contain numbers or symbols";
    }
    return "";
  };

  const validateContactNo = (value: string) => {
    const contactNoRegex = /^[0-9]{10}$/;
    if (!value.trim()) {
      return "Contact No is required";
    }
    if (!value.match(contactNoRegex)) {
      return "Contact No must be 10 digits and cannot contain symbols or words";
    }
    return "";
  };

  const validateMileage = (value: number) => {
    if (value === undefined || value === null) {
      return "Mileage is required";
    }
    if (value < 0 || isNaN(value)) {
      return "Mileage cannot be a negative number or contain symbols/letters";
    }
    return "";
  };

  const validateLastUpdate = (value: string) => {
    if (!value) {
      return "Last Update time is required";
    }
    const currentTime = new Date().toISOString().split('T')[1].substring(0, 5);
    if (value < currentTime) {
      return "Last Update time cannot be in the past";
    }
    return "";
  };

  // Validate a specific field
  const validateField = (name: string, value: string | number) => {
    let error = "";
    switch (name) {
      case "vehicleRegistrationNo":
        error = validateVehicleRegistrationNo(value as string);
        break;
      case "vehicleType":
        error = validateVehicleType(value as string);
        break;
      case "ownerName":
        error = validateOwnerName(value as string);
        break;
      case "contactNo":
        error = validateContactNo(value as string);
        break;
      case "mileage":
        error = validateMileage(parseFloat(value.toString()));
        break;
      case "lastUpdate":
        error = validateLastUpdate(value as string);
        break;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));

    return error === "";
  };

  // Validate entire form
  const validateForm = (vehicle: Vehicle) => {
    const newErrors = {
      vehicleRegistrationNo: validateVehicleRegistrationNo(vehicle.vehicleRegistrationNo),
      vehicleType: validateVehicleType(vehicle.vehicleType),
      ownerName: validateOwnerName(vehicle.ownerName),
      contactNo: validateContactNo(vehicle.contactNo),
      mileage: validateMileage(vehicle.mileage),
      lastUpdate: validateLastUpdate(vehicle.lastUpdate),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Reset errors
  const resetErrors = () => {
    setErrors({
      vehicleRegistrationNo: "",
      vehicleType: "",
      ownerName: "",
      contactNo: "",
      mileage: "",
      lastUpdate: "",
    });
  };

  return {
    errors,
    validateField,
    validateForm,
    setErrors,
    resetErrors
  };
};