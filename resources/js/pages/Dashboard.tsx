import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { aduanService } from '../services/api';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/formatters';
import type { PaginatedResponse, Aduan } from '../types';

const Dashboard = () => {
    const { user } = useAuth();

    // Fetch recent aduan
    const { data: aduanData, isLoading } = useQuery<PaginatedResponse<Aduan>>({
        queryKey: ['aduan', 'recent'],
        queryFn: () => aduanService.getList({ per_page: 5 }),
    });

    const stats = user?.statistics || {
        total_aduan: 0,
        active_aduan: 0,
        completed_aduan: 0,
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Selamat Datang, {user?.name}! 👋
                </h1>
                <p className="text-blue-100">
                    Anda dapat melaporkan keluhan infrastruktur kota dengan mudah dan cepat.
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Aduan</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_aduan}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📋</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Sedang Diproses</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.active_aduan}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">⏳</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Selesai</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed_aduan}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    to="/aduan/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 transition group"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Buat Aduan Baru</h3>
                            <p className="text-blue-100 text-sm">Laporkan keluhan infrastruktur</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/aduan"
                    className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl p-6 transition group"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                            <span className="text-2xl">📋</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Lihat Semua Aduan</h3>
                            <p className="text-gray-600 text-sm">Pantau status aduan Anda</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Aduan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Aduan Terbaru</h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            Memuat data...
                        </div>
                    ) : aduanData?.data && aduanData.data.length > 0 ? (
                        aduanData.data.map((aduan) => (
                            <Link
                                key={aduan.id}
                                to={`/aduan/${aduan.nomor_tiket}`}
                                className="p-6 hover:bg-gray-50 transition block"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="text-sm font-mono font-semibold text-blue-600">
                                                {aduan.nomor_tiket}
                                            </span>
                                            <Badge status={aduan.status} />
                                        </div>
                                        <p className="text-gray-900 font-medium mb-1">
                                            {aduan.kategori?.nama}
                                        </p>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {aduan.deskripsi}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-2">
                                            {formatDate(aduan.created_at)}
                                        </p>
                                    </div>
                                    {aduan.fotos?.[0] && (
                                        <img
                                            src={aduan.fotos[0].thumbnail_url}
                                            alt="Preview"
                                            className="w-16 h-16 rounded-lg object-cover ml-4"
                                        />
                                    )}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <span className="text-4xl mb-2 block">📭</span>
                            <p>Belum ada aduan. Buat aduan pertama Anda!</p>
                        </div>
                    )}
                </div>

                {aduanData?.data && aduanData.data.length > 0 && (
                    <div className="p-4 border-t border-gray-100">
                        <Link
                            to="/aduan"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm block text-center"
                        >
                            Lihat Semua →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
