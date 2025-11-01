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
