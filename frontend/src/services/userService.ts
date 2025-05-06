import axios from "axios";

class UserService {
    static BASE_URL = "https://localhost:3000/";

    static async login(email: string, password: string) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/login`, { email, password });
            return response.data;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    static async register(userData: { username: string; email: string; password: string; role: string }, token: any) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/register`, userData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error registering:", error);
            throw error;
        }
    }

    static async getAllUsers(token: string) {
        try {
            const response = await axios.get(`${this.BASE_URL}/auth/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error registering:", error);
            throw error;
        }
    }

    static async getYourProfile(token: string) {
        try {
            const response = await axios.get(`${this.BASE_URL}/adminuser/get-profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error getting user profile:", error);
            throw error;
        }
    }

    static async getUserById(userId: string, token: string) {
        try {
            const response = await axios.get(`${this.BASE_URL}/admin/get-user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error getting user by ID:", error);
            throw error;
        }
    }

    static async deleteUser(userId: string, token: string) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/admin/delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    static async updateUser(userId: string, userData: { name: string; email: string;}, token: string) {
        try {
            const response = await axios.put(`${this.BASE_URL}/admin/update/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    /**Authentication Checker */
    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem("role");
        return role === "ADMIN";
    }

    static isUser() {
        const role = localStorage.getItem("role");
        return role === "USER";
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
    
}

export default UserService;