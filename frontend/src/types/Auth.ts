export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    role?: string[];
}

export interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    isAdmin: boolean;
}
