import { ReactNode } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles?: string[];
    fallback?: ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, fallback }) => {
    const { user } = useAdminAuth();

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // If no specific roles required, allow all authenticated admin users
    if (!allowedRoles || allowedRoles.length === 0) {
        return <>{children}</>;
    }

    // Check if user's role is in allowed roles
    const hasAccess = allowedRoles.includes(user.role.name);

    if (!hasAccess) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
                    <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default RoleGuard;