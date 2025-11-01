import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import CreateAduan from './pages/aduan/CreateAduan';
import ListAduan from './pages/aduan/ListAduan';
import DetailAduan from './pages/aduan/DetailAduan';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAduanList from './pages/admin/AdminAduanList';
import AdminAduanDetail from './pages/admin/AdminAduanDetail';
import AdminUserList from './pages/admin/AdminUserList';
import AdminUserForm from './pages/admin/AdminUserForm';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import NotFound from './pages/errors/NotFound';
import Forbidden from './pages/errors/Forbidden';
import ServerError from './pages/errors/ServerError';
import Maintenance from './pages/errors/Maintenance';
import AppLayout from './components/layout/AppLayout';
import GuestLayout from './components/layout/GuestLayout';
import AdminLayout from './components/admin/AdminLayout';
import { ReactNode } from 'react';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Jika tidak login, arahkan ke /login.
    return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Guest Route Component
const GuestRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Jika sudah login, arahkan ke /dashboard.
    return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAdminAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Jika tidak login, arahkan ke /admin/login.
    return user ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

// Admin Guest Route Component
const AdminGuestRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAdminAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Jika sudah login, arahkan ke /admin/dashboard.
    return user ? <Navigate to="/admin/dashboard" replace /> : <>{children}</>;
};

function App() {
    return (
        // Membungkus semua Route dengan AuthProvider dan AdminAuthProvider 
        // agar semua route di bawahnya bisa mengakses context
        <AuthProvider>
            <AdminAuthProvider>
                <Routes>
                    {/* --- ROUTE WARGA (Public & Protected) --- */}
                    
                    {/* Guest Routes (Tidak butuh login) */}
                    <Route path="/login" element={
                        <GuestRoute>
                            <GuestLayout>
                                <Login />
                            </GuestLayout>
                        </GuestRoute>
                    } />
                    <Route path="/register" element={
                        <GuestRoute>
                            <GuestLayout>
                                <Register />
                            </GuestLayout>
                        </GuestRoute>
                    } />

                    {/* Protected Routes (Butuh login warga) */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/aduan/create" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <CreateAduan />
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/aduan" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ListAduan />
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/aduan/:nomorTiket" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <DetailAduan />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    {/* Default redirect untuk root path */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />


                    {/* --- ROUTE ADMIN (Public & Protected) --- */}
                    
                    {/* Admin Guest Routes (Tidak butuh login admin) */}
                    <Route path="/admin/login" element={
                        <AdminGuestRoute>
                            <AdminLogin />
                        </AdminGuestRoute>
                    } />

                    {/* Admin Protected Routes (Butuh login admin) */}
                    <Route path="/admin/dashboard" element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminDashboard />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    } />

                    {/* Admin Aduan Routes */}
                    <Route path="/admin/aduan" element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminAduanList />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    } />
                    <Route path="/admin/aduan/:id" element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminAduanDetail />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    } />

                    {/* Admin User Routes */}
                    <Route path="/admin/users" element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminUserList />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    } />
                    <Route path="/admin/users/create" element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminUserForm />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    } />
                    <Route path="/admin/users/:id" element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminUserDetail />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    } />
                    <Route path="/admin/users/:id/edit" element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminUserForm />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    } />

                    {/* Redirect Admin */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    
                    {/* --- ROUTE ERROR (Global) --- */}
                    
                    {/* Error spesifik */}
                    <Route path="/403" element={<Forbidden />} />
                    <Route path="/500" element={<ServerError />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    
                    {/* Catch-all Not Found Route (HARUS PALING AKHIR) */}
                    {/* Menangkap semua path yang tidak cocok dengan route di atasnya */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AdminAuthProvider>
        </AuthProvider>
    );
}

export default App;