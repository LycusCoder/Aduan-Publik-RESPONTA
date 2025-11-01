import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminAduanService, dinasService, organizationService } from '../../services/adminApi';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import type { AdminAduan, AdminAduanFilters, Dinas, Organization, KategoriAduan } from '../../types';
import DataTable from '../../components/ui/DataTable';
import ExportButton from '../../components/ui/ExportButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDataForExport, exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportHelpers';
import { FunnelIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const AdminAduanList: React.FC = () => {
    const { user } = useAdminAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [aduanList, setAduanList] = useState<AdminAduan[]>([]);
    const [total, setTotal] = useState(0);
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [filters, setFilters] = useState<AdminAduanFilters>({
        status: searchParams.get('status') || '',
        kategori_id: searchParams.get('kategori_id') || '',
        dinas_id: searchParams.get('dinas_id') || '',
        priority: searchParams.get('priority') || '',
        organization_id: searchParams.get('organization_id') || '',
        search: searchParams.get('search') || '',
        page: parseInt(searchParams.get('page') || '1'),
        per_page: 15,
        sort_by: searchParams.get('sort_by') || 'created_at',
        sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
    });

    // Data for filters
    const [dinasList, setDinasList] = useState<Dinas[]>([]);
    const [organizationList, setOrganizationList] = useState<Organization[]>([]);
    const [kategoriList, setKategoriList] = useState<KategoriAduan[]>([]);

    useEffect(() => {
        loadAduanList();
        loadFilterData();
    }, [filters]);

    const loadAduanList = async () => {
        setLoading(true);
        try {
            const response = await adminAduanService.getList(filters);
            setAduanList(response.data || []);
            setTotal(response.meta?.total || 0);
        } catch (error) {
            console.error('Failed to load aduan:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFilterData = async () => {
        try {
            const [dinasRes, orgRes, kategoriRes] = await Promise.all([
                dinasService.getList({ active_only: true }),
                organizationService.getList({ active_only: true }),
                axios.get('/api/v1/kategori-aduan'),
            ]);
            setDinasList(dinasRes.data || []);
            setOrganizationList(orgRes.data || []);
            setKategoriList(kategoriRes.data.data || []);
        } catch (error) {
            console.error('Failed to load filter data:', error);
        }
    };

    const handleFilterChange = (key: keyof AdminAduanFilters, value: any) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);
        updateSearchParams(newFilters);
    };

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
        const newFilters = { ...filters, sort_by: key, sort_order: direction };
        setFilters(newFilters);
        updateSearchParams(newFilters);
    };

    const updateSearchParams = (newFilters: AdminAduanFilters) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value.toString());
        });
        setSearchParams(params);
    };

    const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
        const exportData = formatDataForExport(aduanList, [
            { key: 'nomor_tiket', label: 'Nomor Tiket' },
            { key: 'user.name', label: 'Pelapor' },
            { key: 'kategori.nama', label: 'Kategori' },
            { key: 'status', label: 'Status' },
            { key: 'priority', label: 'Prioritas' },
            { key: 'dinas.name', label: 'Dinas' },
            { key: 'created_at', label: 'Tanggal' },
        ]);

        if (format === 'excel') {
            await exportToExcel(exportData, `aduan-${new Date().toISOString().split('T')[0]}`);
        } else if (format === 'csv') {
            exportToCSV(exportData, `aduan-${new Date().toISOString().split('T')[0]}`);
        } else if (format === 'pdf') {
            await exportToPDF(exportData, `aduan-${new Date().toISOString().split('T')[0]}`);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            baru: 'bg-yellow-100 text-yellow-800',
            diverifikasi: 'bg-blue-100 text-blue-800',
            diproses: 'bg-orange-100 text-orange-800',
            selesai: 'bg-green-100 text-green-800',
            ditolak: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityBadge = (priority: string) => {
        const badges: Record<string, string> = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            urgent: 'bg-red-100 text-red-800',
        };
        return badges[priority] || 'bg-gray-100 text-gray-800';
    };

    const columns = [
        {
            key: 'nomor_tiket',
            label: 'Nomor Tiket',
            sortable: true,
            render: (item: AdminAduan) => (
                <Link
                    to={`/admin/aduan/${item.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    {item.nomor_tiket}
                </Link>
            ),
        },
        {
            key: 'user',
            label: 'Pelapor',
            render: (item: AdminAduan) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{item.user.name}</div>
                    <div className="text-xs text-gray-500">{item.user.no_hp}</div>
                </div>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (item: AdminAduan) => (
                <span className="text-sm text-gray-900">{item.kategori.nama}</span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item: AdminAduan) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                    {item.status_label || item.status.toUpperCase()}
                </span>
            ),
        },
        {
            key: 'priority',
            label: 'Prioritas',
            sortable: true,
            render: (item: AdminAduan) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(item.priority)}`}>
                    {item.priority.toUpperCase()}
                </span>
            ),
        },
        {
            key: 'dinas',
            label: 'Dinas',
            render: (item: AdminAduan) => (
                <span className="text-sm text-gray-900">{item.dinas?.name || '-'}</span>
            ),
        },
        {
            key: 'tanggal_aduan',
            label: 'Tanggal',
            sortable: true,
            render: (item: AdminAduan) => (
                <span className="text-sm text-gray-500">
                    {new Date(item.tanggal_aduan).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            render: (item: AdminAduan) => (
                <Link
                    to={`/admin/aduan/${item.id}`}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <EyeIcon className="h-5 w-5" />
                </Link>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Aduan</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Total: {total} aduan
                        {selectedItems.size > 0 && ` | ${selectedItems.size} dipilih`}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <ExportButton onExport={handleExport} disabled={aduanList.length === 0} />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cari
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filters.search || ''}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Cari nomor tiket, deskripsi..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="baru">Baru</option>
                                <option value="diverifikasi">Diverifikasi</option>
                                <option value="diproses">Diproses</option>
                                <option value="selesai">Selesai</option>
                                <option value="ditolak">Ditolak</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prioritas
                            </label>
                            <select
                                value={filters.priority || ''}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Prioritas</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori
                            </label>
                            <select
                                value={filters.kategori_id || ''}
                                onChange={(e) => handleFilterChange('kategori_id', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Kategori</option>
                                {kategoriList.map((kat) => (
                                    <option key={kat.id} value={kat.id}>{kat.nama}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dinas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dinas
                            </label>
                            <select
                                value={filters.dinas_id || ''}
                                onChange={(e) => handleFilterChange('dinas_id', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Dinas</option>
                                {dinasList.map((dinas) => (
                                    <option key={dinas.id} value={dinas.id}>{dinas.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Organization */}
                        {(user?.role.name === 'super_admin' || user?.role.name === 'admin_kota') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kelurahan/Kecamatan
                                </label>
                                <select
                                    value={filters.organization_id || ''}
                                    onChange={(e) => handleFilterChange('organization_id', e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Semua Wilayah</option>
                                    {organizationList.map((org) => (
                                        <option key={org.id} value={org.id}>{org.name} ({org.type})</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Reset button */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                setFilters({
                                    page: 1,
                                    per_page: 15,
                                    sort_by: 'created_at',
                                    sort_order: 'desc',
                                });
                                setSearchParams(new URLSearchParams());
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>
            )}

            {/* Bulk Actions */}
            {selectedItems.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm text-blue-800">
                        {selectedItems.size} aduan dipilih
                    </span>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50">
                            Assign Bulk
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50">
                            Set Priority Bulk
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="Memuat data aduan..." />
                ) : (
                    <DataTable
                        data={aduanList}
                        columns={columns}
                        keyExtractor={(item) => item.id}
                        selectable
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        onSort={handleSort}
                        emptyMessage="Tidak ada data aduan"
                    />
                )}
            </div>

            {/* Pagination */}
            {total > filters.per_page! && (
                <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => handleFilterChange('page', filters.page! - 1)}
                            disabled={filters.page === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handleFilterChange('page', filters.page! + 1)}
                            disabled={filters.page! * filters.per_page! >= total}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Menampilkan{' '}
                                <span className="font-medium">{(filters.page! - 1) * filters.per_page! + 1}</span> sampai{' '}
                                <span className="font-medium">
                                    {Math.min(filters.page! * filters.per_page!, total)}
                                </span>{' '}
                                dari <span className="font-medium">{total}</span> hasil
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => handleFilterChange('page', filters.page! - 1)}
                                    disabled={filters.page === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                                    {filters.page}
                                </span>
                                <button
                                    onClick={() => handleFilterChange('page', filters.page! + 1)}
                                    disabled={filters.page! * filters.per_page! >= total}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAduanList;
