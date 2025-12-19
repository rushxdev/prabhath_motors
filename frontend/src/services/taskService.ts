import axios, { AxiosError } from "axios";
import { Task } from "../types/Task";

const API_URL = "http://localhost:8081/api/tasks";

export const createTask = async (task: Task): Promise<Task> => {
  try {
    const response = await axios.post<Task>(`${API_URL}/add`, task);
    return response.data;
  } catch (error) {
    console.error("Error while creating task", error);

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

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get<Task[]>(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching tasks", error);
    throw error;
  }
};

export const getTaskById = async (id: number): Promise<Task> => {
  try {
    const response = await axios.get<Task>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching task by id", error);
    throw error;
  }
};

export const updateTask = async (id: number, task: Task): Promise<Task> => {
  try {
    const response = await axios.put<Task>(`${API_URL}/update/${id}`, task);
    return response.data;
  } catch (error) {
    console.error("Error while updating task", error);

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

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await axios.delete<void>(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error while deleting task", error);
    throw error;
  }
};
