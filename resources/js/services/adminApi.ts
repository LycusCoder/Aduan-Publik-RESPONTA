import axios, { AxiosInstance } from 'axios';
import type {
    AdminUser,
    AdminAduan,
    Role,
    Organization,
    Dinas,
    DashboardStats,
    Statistics,
    AdminAuthResponse,
    ApiResponse,
    PaginatedResponse,
    AdminAduanFilters,
    AdminUserFilters,
    LoginCredentials,
} from '../types';

const adminApi: AxiosInstance = axios.create({
    baseURL: '/api/v1/admin',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
adminApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// Admin Auth API
export const adminAuthService = {
    login: (credentials: LoginCredentials): Promise<ApiResponse<AdminAuthResponse>> => 
        adminApi.post('/login', credentials),
    
    logout: (): Promise<ApiResponse<null>> => 
        adminApi.post('/logout'),
    
    me: (): Promise<ApiResponse<AdminUser>> => 
        adminApi.get('/me'),
};

// Admin Dashboard API
export const adminDashboardService = {
    getStats: (): Promise<ApiResponse<DashboardStats>> => 
        adminApi.get('/dashboard'),
    
    getStatistics: (days: number = 30): Promise<ApiResponse<Statistics>> => 
        adminApi.get('/statistics', { params: { days } }),
};

// Admin Aduan API
export const adminAduanService = {
    getList: (params?: AdminAduanFilters): Promise<PaginatedResponse<AdminAduan>> => 
        adminApi.get('/aduan', { params }),
    
    getDetail: (id: number): Promise<ApiResponse<AdminAduan>> => 
        adminApi.get(`/aduan/${id}`),
    
    verify: (id: number, notes?: string): Promise<ApiResponse<AdminAduan>> => 
        adminApi.put(`/aduan/${id}/verify`, { notes }),
    
    reject: (id: number, reason: string): Promise<ApiResponse<AdminAduan>> => 
        adminApi.put(`/aduan/${id}/reject`, { reason }),
    
    assignToDinas: (id: number, dinasId: number, notes?: string): Promise<ApiResponse<AdminAduan>> => 
        adminApi.put(`/aduan/${id}/assign`, { 
            type: 'dinas',
            dinas_id: dinasId,
            notes 
        }),
    
    assignToStaff: (id: number, staffId: number, notes?: string): Promise<ApiResponse<AdminAduan>> => 
        adminApi.put(`/aduan/${id}/assign`, { 
            type: 'staff',
            staff_id: staffId,
            notes 
        }),
    
    updateStatus: (id: number, status: string, notes?: string): Promise<ApiResponse<AdminAduan>> => 
        adminApi.put(`/aduan/${id}/status`, { status, notes }),
    
    setPriority: (id: number, priority: string, notes?: string): Promise<ApiResponse<AdminAduan>> => 
        adminApi.put(`/aduan/${id}/priority`, { priority, notes }),
    
    updateProgress: (id: number, progress: number, notes?: string): Promise<ApiResponse<AdminAduan>> => 
        adminApi.put(`/aduan/${id}/progress`, { progress, notes }),
    
    addNotes: (id: number, notes: string): Promise<ApiResponse<null>> => 
        adminApi.post(`/aduan/${id}/notes`, { notes }),
    
    getHistory: (id: number): Promise<ApiResponse<any[]>> => 
        adminApi.get(`/aduan/${id}/history`),
};

// Admin User API
export const adminUserService = {
    getList: (params?: AdminUserFilters): Promise<PaginatedResponse<AdminUser>> => 
        adminApi.get('/users', { params }),
    
    getDetail: (id: number): Promise<ApiResponse<AdminUser>> => 
        adminApi.get(`/users/${id}`),
    
    create: (data: {
        name: string;
        no_hp: string;
        email?: string;
        password: string;
        role_id: number;
        organization_id?: number;
        dinas_id?: number;
        is_admin: boolean;
    }): Promise<ApiResponse<AdminUser>> => 
        adminApi.post('/users', data),
    
    update: (id: number, data: Partial<AdminUser>): Promise<ApiResponse<AdminUser>> => 
        adminApi.put(`/users/${id}`, data),
    
    activate: (id: number, isActive: boolean): Promise<ApiResponse<AdminUser>> => 
        adminApi.put(`/users/${id}/activate`, { is_active: isActive }),
    
    delete: (id: number): Promise<ApiResponse<null>> => 
        adminApi.delete(`/users/${id}`),
    
    getRoles: (): Promise<ApiResponse<Role[]>> => 
        adminApi.get('/roles'),
};

// Organization API
export const organizationService = {
    getList: (params?: { type?: string; parent_id?: string; active_only?: boolean }): Promise<ApiResponse<Organization[]>> => 
        adminApi.get('/organizations', { params }),
    
    getDetail: (id: number): Promise<ApiResponse<Organization>> => 
        adminApi.get(`/organizations/${id}`),
    
    getTree: (id: number): Promise<ApiResponse<Organization>> => 
        adminApi.get(`/organizations/${id}/tree`),
};

// Dinas API
export const dinasService = {
    getList: (params?: { active_only?: boolean; search?: string }): Promise<ApiResponse<Dinas[]>> => 
        adminApi.get('/dinas', { params }),
    
    getDetail: (id: number): Promise<ApiResponse<Dinas>> => 
        adminApi.get(`/dinas/${id}`),
    
    create: (data: {
        organization_id: number;
        name: string;
        code: string;
        description?: string;
        phone?: string;
        email?: string;
        address?: string;
    }): Promise<ApiResponse<Dinas>> => 
        adminApi.post('/dinas', data),
    
    update: (id: number, data: Partial<Dinas>): Promise<ApiResponse<Dinas>> => 
        adminApi.put(`/dinas/${id}`, data),
    
    getStaff: (id: number): Promise<ApiResponse<any[]>> => 
        adminApi.get(`/dinas/${id}/staff`),
};

export default adminApi;
