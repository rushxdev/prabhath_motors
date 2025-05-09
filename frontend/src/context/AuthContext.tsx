import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types/Auth';
import authService from '../services/authService';

interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isLoggedIn: authService.isLoggedIn(),
        user: authService.getCurrentUser(),
        isAdmin: authService.isAdmin()
    });

    useEffect(() => {
        // Check if user is already logged in
        const user = authService.getCurrentUser();
        if (user) {
            setAuthState({
                isLoggedIn: true,
                user,
                isAdmin: authService.isAdmin()
            });
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const user = await authService.login({ username, password });
            setAuthState({
                isLoggedIn: true,
                user,
                isAdmin: user.roles.includes('ROLE_ADMIN')
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setAuthState({
            isLoggedIn: false,
            user: null,
            isAdmin: false
        });
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            await authService.register({ username, email, password });
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const value = {
        ...authState,
        login,
        logout,
        register
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
