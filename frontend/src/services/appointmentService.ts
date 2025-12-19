import axios, { AxiosError } from "axios";
import { Appointment } from "../types/Appointment";

const API_URL = "http://localhost:8081/appointment";

export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await axios.get<Appointment[]>(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching appointments", error);
    throw error;
  }
};

export const addAppointment = async (
  appointment: Appointment
): Promise<Appointment> => {
  try {
    // Format the date and time for the backend
    const formattedAppointment = {
      ...appointment,
      // Ensure date is in ISO format (YYYY-MM-DD)
      date: appointment.date,
      // Ensure time is in 24-hour format (HH:MM)
      time: appointment.time
    };

    const response = await axios.post<Appointment>(
      `${API_URL}/add`,
      formattedAppointment
    );
    return response.data;
  } catch (error) {
    console.error("Error while adding appointment", error);

    // Handle validation errors from the backend
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        // Return the validation errors from the backend
        throw axiosError.response.data;
      }
    }

    throw error;
  }
};

export const getAppointmentById = async (id: number): Promise<Appointment> => {
  try {
    const response = await axios.get<Appointment>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching appointment by id", error);
    throw error;
  }
};

export const updateAppointment = async (
  id: number,
  appointment: Appointment
): Promise<Appointment> => {
  try {
    const response = await axios.put<Appointment>(
      `${API_URL}/${id}`,
      appointment
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating appointment", error);
    throw error;
  }
};

export const deleteAppointment = async (id: number): Promise<void> => {
  try {
    await axios.delete<void>(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error while deleting appointment", error);
    throw error;
  }
};
