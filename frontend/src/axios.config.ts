import axios from 'axios';
import { toast } from 'react-toastify';

// Explicitly set the base URL
const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('Response received:', response);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
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