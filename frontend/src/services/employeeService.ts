import axios from 'axios';
import { Employee } from '../types/Employee';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/dashboard/employee';

const employeeService = {
  getAllEmployees: async (): Promise<Employee[]> => {
    try {
      const response = await axios.get<Employee[]>(`${API_BASE_URL}/getAll`);
      return response.data;
    } catch (error) {
      console.error('Error while fetching employees', error);
      throw error;
    }
  },

  getEmployeeById: async (id: number): Promise<Employee> => {
    try {
      const response = await axios.get<Employee>(`${API_BASE_URL}/get/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error while fetching employee by id', error);
      throw error;
    }
  },

  addEmployee: async (employee: Omit<Employee, 'empId'>): Promise<Employee> => {
    try {
      const response = await axios.post<Employee>(`${API_BASE_URL}/add`, employee);
      return response.data;
    } catch (error) {
      console.error('Error while adding employee', error);
      throw error;
    }
  },

  updateEmployee: async (id: number, employee: Employee): Promise<Employee> => {
    try {
      const response = await axios.put<Employee>(`${API_BASE_URL}/update/${id}`, employee);
      return response.data;
    } catch (error) {
      console.error('Error while updating employee', error);
      throw error;
    }
  },

  deleteEmployee: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error('Error while deleting employee', error);
      throw error;
    }
  }
};

export default employeeService;