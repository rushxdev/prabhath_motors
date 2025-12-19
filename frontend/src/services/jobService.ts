import axios from 'axios';
import { Job } from '../types/Job';
import { Task } from '../types/Task';
import { StockItem } from '../types/Stock';

const API_URL = 'http://localhost:8081/api';

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

    async getJobById(id: number) {
        const response = await axios.get(`${API_URL}/jobs/${id}`);
        return response.data;
    },

    async getJobTasks(jobId: number) {
        const response = await axios.get(`${API_URL}/jobs/${jobId}/tasks`);
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

    async deleteJob(id: string) {
        const response = await axios.delete(`${API_URL}/jobs/${id}`);
        return response.data;
    },

    async getAllEmployees() {
        const response = await axios.get(`http://localhost:8081/employee/getAll`);
        return response.data;
    },

    async getEmployeeById(id: string) {
        const response = await axios.get(`http://localhost:8081/employee/get/${id}`);
        return response.data;
    },

    async addTask(jobId: number, task: Partial<Task>): Promise<Task> {
        const response = await axios.post<Task>(`${API_URL}/jobs/${jobId}/task/save`, task);
        return response.data;
    },

    async updateJobTask(jobId: number, taskId: number, task: Partial<Task>): Promise<Task> {
        const response = await axios.put<Task>(`${API_URL}/jobs/${jobId}/task/${taskId}`, task);
        return response.data;
    },

    async deleteJobTask(jobId: number, taskId: number): Promise<void> {
        await axios.delete(`${API_URL}/jobs/${jobId}/task/${taskId}`);
    },

    async addSparePart(jobId: number, sparePart: Partial<StockItem>): Promise<StockItem> {
        const response = await axios.post<StockItem>(`${API_URL}/jobs/${jobId}/spare-part/save`, sparePart);
        return response.data;
    },

    async getSuggestedTasks(query: string): Promise<string[]> {
        const response = await axios.get<string[]>(`${API_URL}/jobs/suggested-tasks?query=${query}`);
        return response.data;
    },

    async getSuggestedSpareParts(query: string): Promise<StockItem[]> {
        const response = await axios.get<StockItem[]>(`${API_URL}/jobs/suggested-spare-parts?query=${query}`);
        return response.data;
    }
};