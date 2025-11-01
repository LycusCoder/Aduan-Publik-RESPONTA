import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
    HomeIcon,
    DocumentTextIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[]; // If undefined, visible to all
}

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { user } = useAdminAuth();

    const navigation: NavItem[] = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: HomeIcon,
        },
        {
            name: 'Kelola Aduan',
            path: '/admin/aduan',
            icon: DocumentTextIcon,
        },
        {
            name: 'Kelola User',
            path: '/admin/users',
            icon: UserGroupIcon,
            roles: ['super_admin', 'admin_kota', 'kepala_dinas'],
        },
        {
            name: 'Organisasi',
            path: '/admin/organizations',
            icon: BuildingOfficeIcon,
            roles: ['super_admin', 'admin_kota'],
        },
        {
            name: 'Laporan',
            path: '/admin/reports',
            icon: ChartBarIcon,
            roles: ['super_admin', 'admin_kota', 'camat', 'lurah', 'kepala_dinas'],
        },
        {
            name: 'Pengaturan',
            path: '/admin/settings',
            icon: Cog6ToothIcon,
            roles: ['super_admin'],
        },
    ];

    // Filter navigation based on user role
    const visibleNavigation = navigation.filter(item => {
        if (!item.roles) return true; // Visible to all
        return user && item.roles.includes(user.role.name);
    });

    return (
        <div className="flex h-full w-64 flex-col bg-gray-800">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center px-6 bg-gray-900">
                <h1 className="text-xl font-bold text-white">RESPONTA Admin</h1>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col overflow-y-auto pt-4">
                <ul role="list" className="flex flex-1 flex-col gap-y-2 px-3">
                    {visibleNavigation.map((item) => {
                        const isActive = location.pathname === item.path || 
                                       (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`
                                        group flex items-center gap-x-3 rounded-md p-3 text-sm font-semibold transition-colors
                                        ${
                                            isActive
                                                ? 'bg-gray-700 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`h-6 w-6 shrink-0 ${
                                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                        }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User info at bottom */}
            {user && (
                <div className="border-t border-gray-700 p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.role.display_name}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;