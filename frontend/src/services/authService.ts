import { apiClient } from '../axios.config';
import { LoginRequest, SignupRequest, User } from '../types/Auth';

const API_URL = '/api/auth';

class AuthService {
    async login(loginRequest: LoginRequest): Promise<User> {
        const response = await apiClient.post(`${API_URL}/signin`, loginRequest);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    }

    logout(): void {
        apiClient.post(`${API_URL}/signout`).then(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }).catch(error => {
            console.error('Logout error:', error);
            // Still remove items from localStorage even if the API call fails
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        });
    }

    async register(signupRequest: SignupRequest): Promise<any> {
        return apiClient.post(`${API_URL}/signup`, signupRequest);
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        if (user && user.roles) {
            return user.roles.includes('ROLE_ADMIN');
        }
        return false;
    }
}

export default new AuthService();
