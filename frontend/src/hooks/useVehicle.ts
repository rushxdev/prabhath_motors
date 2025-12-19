// Validation functions for vehicle registration

export const validateVehicleRegistrationNo = (value: string): string => {
  if (!value) {
    return "Vehicle registration number is required";
  }
  if (value.length < 5) {
    return "Vehicle registration number must be at least 5 characters";
  }
  if (value.length > 8) {
    return "Vehicle registration number must be at most 8 characters";
  }
  return "";
};

export const validateOwnerName = (value: string): string => {
  if (!value) {
    return "Owner name is required";
  }
  if (value.length < 3) {
    return "Owner name must be at least 3 characters";
  }
  if (!/^[a-zA-Z\s]*$/.test(value)) {
    return "Owner name should only contain letters and spaces";
  }
  return "";
};

export const validateContactNo = (value: string): string => {
  if (!value) {
    return "Contact number is required";
  }
  if (!/^\d{10}$/.test(value)) {
    return "Contact number must be 10 digits";
  }
  return "";
};

export const validateMileage = (value: number): string => {
  if (value === undefined || value === null) {
    return "Mileage is required";
  }
  if (isNaN(value)) {
    return "Mileage must be a valid number";
  }
  if (value < 0) {
    return "Mileage cannot be negative";
  }
  return "";
};

export const validateLastUpdate = (value: string): string => {
  if (!value) {
    return "Last update time is required";
  }
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
    return "Invalid time format";
  }
  return "";
};

// Validation functions for ownership transfer
export const validateNewOwnerName = (value: string): string => {
  if (!value) {
    return "New owner name is required";
  }
  if (value.length < 3) {
    return "New owner name must be at least 3 characters";
  }
  if (!/^[a-zA-Z\s]*$/.test(value)) {
    return "New owner name should only contain letters and spaces";
  }
  return "";
};

export const validateNewOwnerContact = (value: string): string => {
  if (!value) {
    return "New owner contact is required";
  }
  if (!/^\d{10}$/.test(value)) {
    return "New owner contact must be 10 digits";
  }
  return "";
};