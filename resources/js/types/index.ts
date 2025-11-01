// User types
export interface User {
    id: number;
    name: string;
    no_hp: string;
    email?: string;
    nik?: string;
    is_verified: boolean;
    verified_at?: string;
    created_at: string;
    updated_at: string;
    statistics?: {
        total_aduan: number;
        active_aduan: number;
        completed_aduan: number;
    };
}

// Kategori Aduan types
export interface KategoriAduan {
    id: number;
    nama: string;
    slug: string;
    icon?: string;
    deskripsi?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Foto Aduan types
export interface FotoAduan {
    id: number;
    aduan_id: number;
    path: string;
    thumbnail_path?: string;
    url: string;
    thumbnail_url: string;
    file_size: number;
    file_size_human: string;
    mime_type?: string;
    urutan?: number;
    created_at: string;
    updated_at: string;
}

// Aduan types
export interface Aduan {
    id: number;
    user_id: number;
    kategori_aduan_id: number;
    nomor_tiket: string;
    deskripsi: string;
    status: 'baru' | 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak';
    lokasi: {
        latitude: number;
        longitude: number;
        alamat?: string;
    };
    tanggal_aduan: string;
    tanggal_selesai?: string;
    catatan_admin?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    kategori?: KategoriAduan;
    fotos?: FotoAduan[];
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

export interface PaginationMeta {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: PaginationMeta;
    links?: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

// Auth types
export interface LoginCredentials {
    no_hp: string;
    password: string;
}

export interface RegisterData {
    name: string;
    no_hp: string;
    nik: string;
    email?: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    requires_verification?: boolean;
}

// Location types
export interface Location {
    latitude: number;
    longitude: number;
}

// Form types
export interface CreateAduanFormData {
    kategori_aduan_id: string;
    deskripsi: string;
    latitude: number | null;
    longitude: number | null;
    alamat: string;
    fotos: File[];
}

export interface AduanFilters {
    status?: string;
    kategori_aduan_id?: string;
    page?: number;
    per_page?: number;
}

// ========================================
// ADMIN TYPES (Phase 5)
// ========================================

// Role types
export interface Role {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    level: number;
    is_active: boolean;
    created_at: string;
    permissions?: Permission[];
    statistics?: {
        total_users: number;
        active_users: number;
    };
}

// Permission types
export interface Permission {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    group: string;
}

// Organization types
export interface Organization {
    id: number;
    name: string;
    type: 'kota' | 'kecamatan' | 'kelurahan' | 'dinas';
    code?: string;
    address?: string;
    phone?: string;
    email?: string;
    is_active: boolean;
    created_at: string;
    parent?: Organization;
    children?: Organization[];
    statistics?: {
        total_users: number;
        total_aduan: number;
    };
}

// Dinas types
export interface Dinas {
    id: number;
    name: string;
    code: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    is_active: boolean;
    created_at: string;
    organization?: Organization;
    statistics?: {
        total_staff: number;
        total_aduan: number;
        aduan_selesai: number;
        aduan_diproses: number;
    };
}

// Admin User types
export interface AdminUser {
    id: number;
    name: string;
    no_hp: string;
    email?: string;
    is_verified: boolean;
    is_admin: boolean;
    is_active: boolean;
    last_login_at?: string;
    verified_at?: string;
    created_at: string;
    role: {
        id: number;
        name: string;
        display_name: string;
        level: number;
    };
    organization?: {
        id: number;
        name: string;
        type: string;
    };
    dinas?: {
        id: number;
        name: string;
        code: string;
    };
    statistics: {
        total_aduan: number;
        active_aduan: number;
        completed_aduan: number;
        assigned_aduan: number;
    };
}

// Admin Aduan types (extends base Aduan)
export interface AdminAduan extends Omit<Aduan, 'lokasi'> {
    nomor_tiket: string;
    deskripsi: string;
    alamat?: string;
    latitude?: number;
    longitude?: number;
    status: 'baru' | 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak';
    status_label: string;
    status_badge: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    progress: number;
    tanggal_verifikasi?: string;
    tanggal_diproses?: string;
    tanggal_selesai?: string;
    user: {
        id: number;
        name: string;
        no_hp: string;
    };
    kategori: {
        id: number;
        nama: string;
        slug: string;
    };
    dinas?: {
        id: number;
        name: string;
        code: string;
    };
    assigned_user?: {
        id: number;
        name: string;
        role: string;
    };
    verifikator?: {
        id: number;
        name: string;
    };
    organization?: {
        id: number;
        name: string;
        type: string;
    };
    photos?: Array<{
        id: number;
        url: string;
        urutan: number;
    }>;
    catatan_admin?: string;
    catatan_verifikasi?: string;
    catatan_penolakan?: string;
    history?: AduanHistory[];
}

// Aduan History types
export interface AduanHistory {
    action: string;
    user: string;
    old_value?: string;
    new_value?: string;
    notes?: string;
    created_at: string;
}

// Dashboard Statistics types
export interface DashboardStats {
    total_aduan: number;
    aduan_baru: number;
    aduan_diverifikasi: number;
    aduan_diproses: number;
    aduan_selesai: number;
    aduan_ditolak: number;
    total_users?: number;
    active_users?: number;
    total_dinas?: number;
    staff_count?: number;
    assigned_aduan?: number;
    unassigned_aduan?: number;
}

// Statistics types
export interface Statistics {
    aduan_over_time: Array<{
        date: string;
        status: string;
        count: number;
    }>;
    aduan_by_kategori: Array<{
        kategori: string;
        count: number;
    }>;
    aduan_by_priority: Array<{
        priority: string;
        count: number;
    }>;
    response_time: {
        avg_verification_time_hours: number;
        avg_process_start_time_hours: number;
        avg_resolution_time_hours: number;
    };
    recent_activities: Array<{
        action: string;
        user: string;
        nomor_tiket: string;
        notes?: string;
        created_at: string;
    }>;
    aduan_by_organization?: Array<{
        organization: string;
        type: string;
        count: number;
    }>;
    aduan_by_dinas?: Array<{
        dinas: string;
        count: number;
    }>;
}

// Admin Auth types
export interface AdminAuthResponse {
    user: AdminUser;
    token: string;
}

// Admin Filters
export interface AdminAduanFilters {
    status?: string;
    kategori_id?: string;
    dinas_id?: string;
    priority?: string;
    organization_id?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface AdminUserFilters {
    role_id?: string;
    organization_id?: string;
    dinas_id?: string;
    is_active?: boolean;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}
