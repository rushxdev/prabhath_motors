import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        
        switch (error.response?.status) {
            case 401:
                toast.error('Please login again');
                // Redirect to login page or handle auth error
                break;
            case 403:
                toast.error('You do not have permission to perform this action');
                break;
            case 404:
                toast.error('Resource not found');
                break;
            case 422:
                toast.error('Invalid data provided');
                break;
            default:
                toast.error(message);
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;