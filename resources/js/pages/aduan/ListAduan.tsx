import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { aduanService, kategoriService } from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';
import type { PaginatedResponse, Aduan, KategoriAduan, ApiResponse, AduanFilters } from '../../types';

const ListAduan = () => {
    const [filters, setFilters] = useState<AduanFilters>({
        status: '',
        kategori_aduan_id: '',
        page: 1,
        per_page: 12,
    });

    // Fetch kategori list
    const { data: kategoriResponse } = useQuery<ApiResponse<KategoriAduan[]>>({
        queryKey: ['kategori'],
        queryFn: kategoriService.getAll,
    });

    const kategoriList = kategoriResponse?.data?.filter((k) => k.is_active) || [];

    // Fetch aduan list
    const { data: aduanData, isLoading, error } = useQuery<PaginatedResponse<Aduan>>({
        queryKey: ['aduan', 'list', filters],
        queryFn: () => aduanService.getList(filters),
    });

    const handleFilterChange = (key: keyof AduanFilters, value: string | number) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleResetFilters = () => {
        setFilters({
            status: '',
            kategori_aduan_id: '',
            page: 1,
            per_page: 12,
        });
    };

    const statusOptions = [
        { value: '', label: 'Semua Status' },
        { value: 'baru', label: 'Baru' },
        { value: 'diverifikasi', label: 'Diverifikasi' },
        { value: 'diproses', label: 'Diproses' },
        { value: 'selesai', label: 'Selesai' },
        { value: 'ditolak', label: 'Ditolak' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Aduan</h1>
                    <p className="text-gray-600">Kelola dan pantau semua aduan Anda</p>
                </div>
                <Link to="/aduan/create">
                    <Button variant="primary">+ Buat Aduan Baru</Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Kategori Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kategori
                        </label>
                        <select
                            value={filters.kategori_aduan_id}
                            onChange={(e) => handleFilterChange('kategori_aduan_id', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            <option value="">Semua Kategori</option>
                            {kategoriList.map((kategori) => (
                                <option key={kategori.id} value={kategori.id}>
                                    {kategori.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end">
                        <Button
                            variant="secondary"
                            onClick={handleResetFilters}
                            className="w-full"
                        >
                            Reset Filter
                        </Button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            {aduanData?.meta && (
                <div className="text-sm text-gray-600">
                    Menampilkan {aduanData.data.length} dari {aduanData.meta.total} aduan
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data aduan...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">❌</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
                    <p className="text-gray-600">Terjadi kesalahan saat memuat data aduan.</p>
                </div>
            )}

            {/* Aduan Grid */}
            {!isLoading && !error && aduanData?.data && (
                <>
                    {aduanData.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {aduanData.data.map((aduan) => (
                                <Link
                                    key={aduan.id}
                                    to={`/aduan/${aduan.nomor_tiket}`}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
                                >
                                    {/* Thumbnail */}
                                    {aduan.fotos?.[0] ? (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={aduan.fotos[0].url}
                                                alt={aduan.kategori?.nama}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <Badge status={aduan.status} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                                            <span className="text-6xl">📋</span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="mb-3">
                                            <span className="text-xs font-mono font-semibold text-blue-600">
                                                {aduan.nomor_tiket}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                                            {aduan.kategori?.nama}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {aduan.deskripsi}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>📅 {formatDate(aduan.created_at)}</span>
                                            {aduan.fotos && aduan.fotos.length > 1 && (
                                                <span>📷 {aduan.fotos.length} foto</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">📭</span>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tidak Ada Aduan</h2>
                            <p className="text-gray-600 mb-6">
                                {filters.status || filters.kategori_aduan_id
                                    ? 'Tidak ada aduan yang sesuai dengan filter.'
                                    : 'Belum ada aduan. Buat aduan pertama Anda!'}
                            </p>
                            {(filters.status || filters.kategori_aduan_id) && (
                                <Button variant="secondary" onClick={handleResetFilters}>
                                    Reset Filter
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {aduanData.meta && aduanData.meta.total_pages > 1 && (
                        <div className="flex items-center justify-center space-x-2 mt-8">
                            <Button
                                variant="secondary"
                                onClick={() => handlePageChange(filters.page! - 1)}
                                disabled={filters.page === 1}
                            >
                                ← Sebelumnya
                            </Button>
                            
                            <div className="flex items-center space-x-2">
                                {Array.from({ length: aduanData.meta.total_pages }, (_, i) => i + 1)
                                    .filter((page) => {
                                        const current = filters.page!;
                                        return (
                                            page === 1 ||
                                            page === aduanData.meta.total_pages ||
                                            (page >= current - 1 && page <= current + 1)
                                        );
                                    })
                                    .map((page, index, array) => (
                                        <div key={page} className="flex items-center space-x-2">
                                            {index > 0 && array[index - 1] !== page - 1 && (
                                                <span className="text-gray-400">...</span>
                                            )}
                                            <button
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-lg font-medium transition ${
                                                    page === filters.page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            <Button
                                variant="secondary"
                                onClick={() => handlePageChange(filters.page! + 1)}
                                disabled={filters.page === aduanData.meta.total_pages}
                            >
                                Selanjutnya →
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListAduan;
