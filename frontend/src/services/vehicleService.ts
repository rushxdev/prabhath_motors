import axios from "axios";
import { Vehicle, OwnershipHistory } from "../types/Vehicle";

const API_URL = "http://localhost:8080/vehicle";

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get<Vehicle[]>(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching vehicles", error);
    throw error;
  }
};

export const addVehicle = async (
  vehicle: Vehicle
): Promise<Vehicle> => {
  try {
    const response = await axios.post<Vehicle>(
      `${API_URL}/add`,
      vehicle
    );
    return response.data;
  } catch (error) {
    console.error("Error while adding vehicle", error);
    throw error;
  }
};

export const getVehicleById = async (id: number): Promise<Vehicle> => {
  try {
    const response = await axios.get<Vehicle>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching vehicle by id", error);
    throw error;
  }
};

export const updateVehicle = async (
  id: number,
  vehicle: Vehicle
): Promise<Vehicle> => {
  try {
    const response = await axios.put<Vehicle>(
      `${API_URL}/${id}`,
      vehicle
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating vehicle", error);
    throw error;
  }
};

export const deleteVehicle = async (id: number): Promise<void> => {
  try {
    await axios.delete<void>(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error while deleting vehicle", error);
    throw error;
  }
};

export const transferVehicleOwnership = async (
  vehicleId: number,
  newOwnerName: string,
  newOwnerContact: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/transfer-ownership`, {
      vehicleId,
      newOwnerName,
      newOwnerContact
    });
  } catch (error) {
    console.error("Error while transferring vehicle ownership", error);
    throw error;
  }
};

export const getOwnershipHistory = async (vehicleId: number): Promise<OwnershipHistory[]> => {
  try {
    const response = await axios.get(`${API_URL}/ownership-history/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching ownership history", error);
    throw error;
  }
};

export const clearOwnershipHistory = async (vehicleId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/ownership-history/${vehicleId}/clear`);
  } catch (error) {
    console.error("Error while clearing ownership history", error);
    throw error;
  }
};
