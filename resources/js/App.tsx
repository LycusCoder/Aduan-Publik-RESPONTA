import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import CreateAduan from './pages/aduan/CreateAduan';
import ListAduan from './pages/aduan/ListAduan';
import DetailAduan from './pages/aduan/DetailAduan';
import AppLayout from './components/layout/AppLayout';
import GuestLayout from './components/layout/GuestLayout';
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

    return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Guest Routes */}
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

                {/* Protected Routes */}
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

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;