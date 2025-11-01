import axios, { AxiosInstance } from 'axios';
import type {
    User,
    KategoriAduan,
    Aduan,
    LoginCredentials,
    RegisterData,
    AuthResponse,
    ApiResponse,
    PaginatedResponse,
    AduanFilters,
} from '../types';

const api: AxiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authService = {
    register: (data: RegisterData): Promise<ApiResponse<AuthResponse>> => 
        api.post('/register', data),
    
    login: (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => 
        api.post('/login', credentials),
    
    logout: (): Promise<ApiResponse<null>> => 
        api.post('/logout'),
    
    getProfile: (): Promise<ApiResponse<User>> => 
        api.get('/profile'),
    
    updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> => 
        api.put('/profile', data),
};

// Kategori API
export const kategoriService = {
    getAll: (): Promise<ApiResponse<KategoriAduan[]>> => 
        api.get('/kategori-aduan'),
};

// Aduan API
export const aduanService = {
    create: (formData: FormData) => {
        return axios.post('/api/v1/aduan', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
    },
    
    getList: (params?: AduanFilters): Promise<PaginatedResponse<Aduan>> => 
        api.get('/aduan', { params }),
    
    getDetail: (nomorTiket: string): Promise<ApiResponse<Aduan>> => 
        api.get(`/aduan/${nomorTiket}`),
    
    update: (nomorTiket: string, data: Partial<Aduan>): Promise<ApiResponse<Aduan>> => 
        api.put(`/aduan/${nomorTiket}`, data),
    
    delete: (nomorTiket: string): Promise<ApiResponse<null>> => 
        api.delete(`/aduan/${nomorTiket}`),
};

export default api;