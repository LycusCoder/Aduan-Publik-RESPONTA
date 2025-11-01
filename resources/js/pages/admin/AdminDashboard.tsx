import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { adminDashboardService } from '../../services/adminApi';
import type { DashboardStats, Statistics } from '../../types';
import {
    ChartBarIcon,
    DocumentTextIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
    const { user } = useAdminAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, statisticsRes] = await Promise.all([
                adminDashboardService.getStats(),
                adminDashboardService.getStatistics(30),
            ]);
            setStats(statsRes.data);
            setStatistics(statisticsRes.data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            name: 'Total Aduan',
            value: stats?.total_aduan || 0,
            icon: DocumentTextIcon,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            name: 'Aduan Baru',
            value: stats?.aduan_baru || 0,
            icon: ClockIcon,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            name: 'Sedang Diproses',
            value: stats?.aduan_diproses || 0,
            icon: ChartBarIcon,
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            name: 'Selesai',
            value: stats?.aduan_selesai || 0,
            icon: CheckCircleIcon,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            name: 'Ditolak',
            value: stats?.aduan_ditolak || 0,
            icon: XCircleIcon,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ];

    // Add role-specific stats
    if (user?.role.name === 'super_admin' || user?.role.name === 'admin_kota') {
        statCards.push({
            name: 'Total User',
            value: stats?.total_users || 0,
            icon: UserGroupIcon,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
        });
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Selamat Datang, {user?.name}!
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    {user?.role.display_name} | {user?.organization?.name || user?.dinas?.name || 'RESPONTA'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Aduan by Kategori */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Aduan per Kategori</h3>
                    {statistics?.aduan_by_kategori && statistics.aduan_by_kategori.length > 0 ? (
                        <div className="space-y-3">
                            {statistics.aduan_by_kategori.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{item.kategori}</span>
                                            <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(item.count / (stats?.total_aduan || 1)) * 100}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Belum ada data</p>
                    )}
                </div>

                {/* Aduan by Priority */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Aduan per Prioritas</h3>
                    {statistics?.aduan_by_priority && statistics.aduan_by_priority.length > 0 ? (
                        <div className="space-y-3">
                            {statistics.aduan_by_priority.map((item, index) => {
                                const priorityColors: Record<string, string> = {
                                    urgent: 'bg-red-600',
                                    high: 'bg-orange-500',
                                    medium: 'bg-yellow-500',
                                    low: 'bg-green-500',
                                };
                                return (
                                    <div key={index} className="flex items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {item.priority}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`${priorityColors[item.priority] || 'bg-blue-600'} h-2 rounded-full`}
                                                    style={{
                                                        width: `${(item.count / (stats?.total_aduan || 1)) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Belum ada data</p>
                    )}
                </div>
            </div>

            {/* Response Time Stats */}
            {statistics?.response_time && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Waktu Respons Rata-rata</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-blue-600">Waktu Verifikasi</p>
                            <p className="text-2xl font-bold text-blue-900 mt-1">
                                {statistics.response_time.avg_verification_time_hours.toFixed(1)} jam
                            </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-orange-600">Waktu Mulai Proses</p>
                            <p className="text-2xl font-bold text-orange-900 mt-1">
                                {statistics.response_time.avg_process_start_time_hours.toFixed(1)} jam
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-green-600">Waktu Penyelesaian</p>
                            <p className="text-2xl font-bold text-green-900 mt-1">
                                {statistics.response_time.avg_resolution_time_hours.toFixed(1)} jam
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activities */}
            {statistics?.recent_activities && statistics.recent_activities.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Aktivitas Terbaru</h3>
                    <div className="flow-root">
                        <ul className="-mb-8">
                            {statistics.recent_activities.map((activity, index) => (
                                <li key={index}>
                                    <div className="relative pb-8">
                                        {index !== statistics.recent_activities.length - 1 ? (
                                            <span
                                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                aria-hidden="true"
                                            />
                                        ) : null}
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                    <DocumentTextIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                                                        <span className="font-medium">{activity.nomor_tiket}</span>
                                                    </p>
                                                    {activity.notes && (
                                                        <p className="mt-0.5 text-sm text-gray-500">{activity.notes}</p>
                                                    )}
                                                </div>
                                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                    {activity.created_at}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
