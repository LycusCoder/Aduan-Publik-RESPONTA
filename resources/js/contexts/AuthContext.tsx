import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import type { User, LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
    register: (data: RegisterData) => Promise<ApiResponse<AuthResponse>>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await authService.getProfile();
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
        const response = await authService.login(credentials);
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return response;
    };

    const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
        const response = await authService.register(data);
        // If OTP is disabled, user will get token immediately
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
        }
        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
