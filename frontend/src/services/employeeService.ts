import axios from 'axios';
import { Employee } from '../types/Employee';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/employees';

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const { data } = await axios.get<Employee[]>(API_BASE_URL);
    return data;
  },

  getEmployeeById: async (id: number): Promise<Employee> => {
    const { data } = await axios.get<Employee>(`${API_BASE_URL}/${id}`);
    return data;
  },

  createEmployee: async (employee: Omit<Employee, 'empId'>): Promise<Employee> => {
    const { data } = await axios.post<Employee>(API_BASE_URL, employee);
    return data;
  },

  updateEmployee: async (id: number, employee: Employee): Promise<Employee> => {
    const { data } = await axios.put<Employee>(`${API_BASE_URL}/${id}`, employee);
    return data;
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  }
};