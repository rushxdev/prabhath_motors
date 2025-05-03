import axios from 'axios';
import { Job, Task, SparePart } from '../types/Job';

const API_URL = 'http://localhost:8080/api';

export const jobService = {
    async createJob(jobData: Partial<Job>) {
        const response = await axios.post(`${API_URL}/jobs/assign`, jobData);
        return response.data;
    },

    async getAllOngoingJobs() {
        const response = await axios.get(`${API_URL}/jobs/ongoing`);
        return response.data;
    },

    async getAllDoneJobs() {
        const response = await axios.get(`${API_URL}/jobs/done`);
        return response.data;
    },

    async updateJob(id: string, jobData: Partial<Job>) {
        const response = await axios.put(`${API_URL}/jobs/update/${id}`, jobData);
        return response.data;
    },

    async markJobAsDone(id: string) {
        const response = await axios.put(`${API_URL}/jobs/done/${id}`);
        return response.data;
    },

    async getAllEmployees() {
        const response = await axios.get(`${API_URL}/dashboard/employee/getAll`);
        return response.data;
    },

    async getEmployeeById(id: string) {
        const response = await axios.get(`${API_URL}/dashboard/employee/get/${id}`);
        return response.data;
    },

    async addTask(jobId: number, task: Partial<Task>): Promise<Task> {
        const response = await axios.post<Task>(`${API_URL}/jobs/${jobId}/task/save`, task);
        return response.data;
    },

    async addSparePart(jobId: number, sparePart: Partial<SparePart>): Promise<SparePart> {
        const response = await axios.post<SparePart>(`${API_URL}/jobs/${jobId}/spare-part/save`, sparePart);
        return response.data;
    },

    async getSuggestedTasks(query: string): Promise<string[]> {
        const response = await axios.get<string[]>(`${API_URL}/jobs/suggested-tasks?query=${query}`);
        return response.data;
    },

    async getSuggestedSpareParts(query: string): Promise<SparePart[]> {
        const response = await axios.get<SparePart[]>(`${API_URL}/jobs/suggested-spare-parts?query=${query}`);
        return response.data;
    }
}; 